$file = "app\dashboard\pages\about\page.js"
$content = Get-Content $file -Raw

# Replace the default content
$content = $content -replace "hero: \{[^}]+\},[^}]+\}","mission: 'To provide quality education and holistic development to students from rural Karnataka.',
          vision: 'To be a leading institution that empowers students to become responsible citizens and future leaders.',
          history: 'Established in 1985, GJTS Karnataka has been serving the educational needs of rural communities for over 35 years.',
          values: 'Excellence, Integrity, Innovation, Inclusivity, and Community Service.'"

$content = $content -replace "stats: \{[^}]+\}","mission: 'To provide quality education and holistic development to students from rural Karnataka.',
          vision: 'To be a leading institution that empowers students to become responsible citizens and future leaders.',
          history: 'Established in 1985, GJTS Karnataka has been serving the educational needs of rural communities for over 35 years.',
          values: 'Excellence, Integrity, Innovation, Inclusivity, and Community Service.'"

# Remove the hero and stats sections and replace with simple sections
$content = $content -replace "(?s)\/\* Hero Section \*\/.*?<\/section>","<!-- Mission Section -->"
$content = $content -replace "(?s)\/\* Stats Section \*\/.*?<\/section>","<!-- Vision Section -->"

Set-Content $file -Value $content
Write-Host "File updated successfully!"
