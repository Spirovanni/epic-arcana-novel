#!/usr/bin/env tsx

import fs from 'fs'
import path from 'path'
import { buildPersonalStyleForChapter, PersonalStyleSection } from '../content/personalStyle'

async function buildAllPersonalStyles() {
  console.log('🚀 Building Personal Style content for all 360 EA profiles...')
  
  const results: PersonalStyleSection[] = []
  const errors: Array<{ chapter: number; error: string }> = []
  
  // Create dist directory if it doesn't exist
  const distDir = path.join(process.cwd(), 'dist')
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true })
  }

  const startTime = Date.now()
  
  // Process in batches to avoid overwhelming the system
  const batchSize = 20
  const totalBatches = Math.ceil(360 / batchSize)
  
  for (let batch = 0; batch < totalBatches; batch++) {
    const batchStart = batch * batchSize + 1
    const batchEnd = Math.min((batch + 1) * batchSize, 360)
    
    console.log(`📦 Processing batch ${batch + 1}/${totalBatches}: chapters ${batchStart}-${batchEnd}`)
    
    const batchPromises = []
    for (let chapter = batchStart; chapter <= batchEnd; chapter++) {
      batchPromises.push(
        buildPersonalStyleForChapter(chapter)
          .then(result => ({ chapter, result }))
          .catch(error => ({ chapter, error: error.message }))
      )
    }
    
    const batchResults = await Promise.all(batchPromises)
    
    for (const item of batchResults) {
      if ('result' in item) {
        results.push(item.result)
        
        // Validate result
        const validation = validatePersonalStyleSection(item.result)
        if (!validation.valid) {
          console.warn(`⚠️  Validation warnings for chapter ${item.chapter}:`, validation.warnings)
        }
        
        if ((item.chapter % 50) === 0) {
          console.log(`✅ Completed ${item.chapter}/360 profiles`)
        }
      } else {
        errors.push({ chapter: item.chapter, error: item.error })
        console.error(`❌ Error processing chapter ${item.chapter}: ${item.error}`)
      }
    }
    
    // Small delay between batches to prevent overwhelming the system
    if (batch < totalBatches - 1) {
      await new Promise(resolve => setTimeout(resolve, 100))
    }
  }

  // Sort results by chapter
  results.sort((a, b) => a.chapter - b.chapter)
  
  // Write results to file
  const outputPath = path.join(distDir, 'personal_style_1-360.json')
  fs.writeFileSync(outputPath, JSON.stringify(results, null, 2))
  
  const endTime = Date.now()
  const duration = (endTime - startTime) / 1000
  
  console.log('\n📊 Build Summary:')
  console.log(`✅ Successfully processed: ${results.length}/360 profiles`)
  console.log(`❌ Errors: ${errors.length}`)
  console.log(`⏱️  Total time: ${duration.toFixed(1)}s`)
  console.log(`📁 Output file: ${outputPath}`)
  
  if (errors.length > 0) {
    console.log('\n❌ Errors encountered:')
    errors.forEach(({ chapter, error }) => {
      console.log(`  Chapter ${chapter}: ${error}`)
    })
    
    // Write errors to separate file
    const errorsPath = path.join(distDir, 'personal_style_errors.json')
    fs.writeFileSync(errorsPath, JSON.stringify(errors, null, 2))
    console.log(`📁 Errors logged to: ${errorsPath}`)
  }
  
  // Generate sample report
  if (results.length > 0) {
    generateSampleReport(results.slice(0, 3), distDir)
  }
  
  console.log('\n🎉 Personal Style build completed!')
  
  return {
    success: results.length,
    errors: errors.length,
    outputPath,
    duration
  }
}

interface ValidationResult {
  valid: boolean
  warnings: string[]
}

function validatePersonalStyleSection(section: PersonalStyleSection): ValidationResult {
  const warnings: string[] = []

  // Check required fields
  if (!section.chapter || section.chapter < 1 || section.chapter > 360) {
    warnings.push(`Invalid chapter: ${section.chapter}`)
  }
  
  if (!section.ea_id || !section.ea_id.match(/^EA-\d{3}$/)) {
    warnings.push(`Invalid EA ID: ${section.ea_id}`)
  }
  
  if (!section.display_name || section.display_name.trim().length === 0) {
    warnings.push('Missing display name')
  }
  
  if (!section.family_number || section.family_number < 1 || section.family_number > 9) {
    warnings.push(`Invalid family number: ${section.family_number}`)
  }

  // Check paragraphs
  if (!Array.isArray(section.paragraphs) || section.paragraphs.length < 5 || section.paragraphs.length > 7) {
    warnings.push(`Invalid paragraphs count: ${section.paragraphs?.length || 0} (expected 5-7)`)
  } else {
    section.paragraphs.forEach((paragraph, index) => {
      if (!paragraph || paragraph.trim().length < 50) {
        warnings.push(`Paragraph ${index + 1} too short: ${paragraph?.length || 0} chars`)
      }
      if (paragraph && paragraph.length > 1000) {
        warnings.push(`Paragraph ${index + 1} too long: ${paragraph.length} chars`)
      }
      if (paragraph && (paragraph.includes('[[') || paragraph.includes('{{') || paragraph.includes('placeholder'))) {
        warnings.push(`Paragraph ${index + 1} contains placeholder text`)
      }
      if (paragraph && !paragraph.match(/[.!?]$/)) {
        warnings.push(`Paragraph ${index + 1} doesn't end with punctuation`)
      }
    })
  }

  // Check highlights
  if (!Array.isArray(section.highlights) || section.highlights.length < 5 || section.highlights.length > 8) {
    warnings.push(`Invalid highlights count: ${section.highlights?.length || 0} (expected 5-8)`)
  } else {
    section.highlights.forEach((highlight, index) => {
      if (!highlight || highlight.trim().length < 10) {
        warnings.push(`Highlight ${index + 1} too short`)
      }
      if (highlight && highlight.length > 100) {
        warnings.push(`Highlight ${index + 1} too long: ${highlight.length} chars`)
      }
      if (highlight && !highlight.match(/^[A-Z]/)) {
        warnings.push(`Highlight ${index + 1} should start with capital letter`)
      }
    })
  }

  // Check total content length
  const totalContent = section.paragraphs.join(' ')
  if (totalContent.length < 500) {
    warnings.push(`Total content too short: ${totalContent.length} chars`)
  }

  // Check version
  if (section.version !== 'PS-1.0.0') {
    warnings.push(`Invalid version: ${section.version}`)
  }

  return {
    valid: warnings.length === 0,
    warnings
  }
}

function generateSampleReport(samples: PersonalStyleSection[], outputDir: string) {
  let report = '# Personal Style Sample Report\n\n'
  
  samples.forEach(sample => {
    report += `## ${sample.display_name} (${sample.ea_id})\n\n`
    report += `**Family:** ${sample.family_number} | **Theme:** ${sample.theme} | **Color:** ${sample.color_hex}\n\n`
    
    report += '### Paragraphs:\n\n'
    sample.paragraphs.forEach((paragraph, index) => {
      const labels = ['Identity', 'Operating', 'Decisions', 'Collaboration', 'Stress', 'Growth']
      report += `**${labels[index] || `Paragraph ${index + 1}`}:** ${paragraph}\n\n`
    })
    
    report += '### Highlights:\n\n'
    sample.highlights.forEach(highlight => {
      report += `- ${highlight}\n`
    })
    
    report += '\n---\n\n'
  })
  
  const reportPath = path.join(outputDir, 'personal_style_sample.md')
  fs.writeFileSync(reportPath, report)
  console.log(`📄 Sample report generated: ${reportPath}`)
}

// Run the build if this script is executed directly
if (require.main === module) {
  buildAllPersonalStyles().catch(error => {
    console.error('💥 Build failed:', error)
    process.exit(1)
  })
}

export { buildAllPersonalStyles, validatePersonalStyleSection }