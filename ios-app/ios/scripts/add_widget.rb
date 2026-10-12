# Adds the "Today" home-screen widget (ios/TodayWidget) to Runner.xcodeproj
# as an app extension, on the Codemagic Mac before signing. Done here rather
# than committed because Xcode's project file cannot be edited reliably
# without Xcode, and the xcodeproj gem ships with CocoaPods on every build Mac.
# Safe to run twice.
require 'xcodeproj'

BUNDLE = 'app.nabutarot.ios.today'
ios = File.expand_path('..', __dir__)
proj = Xcodeproj::Project.open(File.join(ios, 'Runner.xcodeproj'))
app = proj.targets.find { |t| t.name == 'Runner' } or abort('no Runner target')
if proj.targets.any? { |t| t.name == 'TodayWidget' }
  puts 'TodayWidget already in the project'
  exit 0
end

ext = proj.new_target(:app_extension, 'TodayWidget', :ios, '16.0', nil, :swift)
group = proj.main_group.find_subpath('TodayWidget', true)
group.set_source_tree('<group>')
group.set_path('TodayWidget')
ext.add_file_references([group.new_reference('TodayWidget.swift')])
ext.resources_build_phase.add_file_reference(group.new_reference('lunar.json'))
group.new_reference('Info.plist')
ext.add_system_framework(%w[WidgetKit SwiftUI])

# Not the app's xcconfig: that would link the app's plugins into the widget.
# The version must equal the app's, so the build passes it in (codemagic.yaml).
name = ENV['NABU_BUILD_NAME'] or abort('NABU_BUILD_NAME not set')
number = ENV['NABU_BUILD_NUMBER'] or abort('NABU_BUILD_NUMBER not set')
ext.build_configurations.each do |c|
  s = c.build_settings
  s['MARKETING_VERSION'] = name
  s['CURRENT_PROJECT_VERSION'] = number
  s['PRODUCT_BUNDLE_IDENTIFIER'] = BUNDLE
  s['PRODUCT_NAME'] = 'TodayWidget'
  s['INFOPLIST_FILE'] = 'TodayWidget/Info.plist'
  s['GENERATE_INFOPLIST_FILE'] = 'NO'
  s['SWIFT_VERSION'] = '5.0'
  s['TARGETED_DEVICE_FAMILY'] = '1'
  s['IPHONEOS_DEPLOYMENT_TARGET'] = '16.0'
  s['SKIP_INSTALL'] = 'YES'
  s['LD_RUNPATH_SEARCH_PATHS'] = ['$(inherited)', '@executable_path/Frameworks', '@executable_path/../../Frameworks']
  s['ASSETCATALOG_COMPILER_GENERATE_SWIFT_ASSET_SYMBOL_EXTENSIONS'] = 'NO'
  s.delete('ASSETCATALOG_COMPILER_APPICON_NAME')
end

# Embed in the app, before Flutter's "Thin Binary" script (after it, Xcode
# reports a dependency cycle).
embed = app.new_copy_files_build_phase('Embed Foundation Extensions')
embed.symbol_dst_subfolder_spec = :plug_ins
embed.add_file_reference(ext.product_reference).settings = { 'ATTRIBUTES' => ['RemoveHeadersOnCopy'] }
thin = app.build_phases.index { |p| p.respond_to?(:name) && p.name == 'Thin Binary' }
if thin
  app.build_phases.delete(embed)
  app.build_phases.insert(thin, embed)
end
app.add_dependency(ext)

proj.save
puts "TodayWidget added (#{BUNDLE})"
