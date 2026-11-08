// يثبّت التطبيق على الوضع العمودي (الطاولة مصممة للطول) — أندرويد و iOS
const fs = require('fs');
const path = require('path');

const man = path.join(__dirname, '..', 'android/app/src/main/AndroidManifest.xml');
if (fs.existsSync(man)) {
  let x = fs.readFileSync(man, 'utf8');
  if (!/android:screenOrientation=/.test(x)) {
    x = x.replace(/(<activity\b[^>]*android:name="[^"]*MainActivity"[^>]*?)(\s*>)/, '$1\n            android:screenOrientation="portrait"$2');
    fs.writeFileSync(man, x);
  }
  // المحادثة الصوتية: صلاحية المايك
  for (const perm of ['android.permission.RECORD_AUDIO', 'android.permission.MODIFY_AUDIO_SETTINGS']) {
    if (!x.includes(perm)) { x = x.replace('</manifest>', `    <uses-permission android:name="${perm}" />\n</manifest>`); }
  }
  fs.writeFileSync(man, x);
  console.log('android mic permission:', x.includes('RECORD_AUDIO'));
  console.log('android portrait:', /android:screenOrientation="portrait"/.test(x));
}

const plist = path.join(__dirname, '..', 'ios/App/App/Info.plist');
if (fs.existsSync(plist)) {
  let x = fs.readFileSync(plist, 'utf8');
  const portrait = '<array>\n\t\t<string>UIInterfaceOrientationPortrait</string>\n\t</array>';
  x = x.replace(/(<key>UISupportedInterfaceOrientations<\/key>\s*)<array>[\s\S]*?<\/array>/, '$1' + portrait);
  x = x.replace(/(<key>UISupportedInterfaceOrientations~ipad<\/key>\s*)<array>[\s\S]*?<\/array>/, '$1' + '<array>\n\t\t<string>UIInterfaceOrientationPortrait</string>\n\t\t<string>UIInterfaceOrientationPortraitUpsideDown</string>\n\t</array>');
  if (!x.includes('NSMicrophoneUsageDescription')) {
    x = x.replace(/<\/dict>\s*<\/plist>\s*$/, '\t<key>NSMicrophoneUsageDescription</key>\n\t<string>المايك يُستخدم فقط للمحادثة الصوتية مع اللاعبين على الطاولة.</string>\n</dict>\n</plist>\n');
  }
  fs.writeFileSync(plist, x);
  console.log('ios portrait + mic: ok');
}
