import express from 'express';
import path from 'path';
import { getForcedChoiceItems } from './items/items_forced.js';
import { getLikertItems } from './items/items_likert.js';
import { scoreAssessment } from './scoring/score_engine.js';
import { buildReport } from './report/build_report.js';
import { AssessmentAnswersSchema } from './schema.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static('public'));

// Serve the web UI
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>LSA Assessment</title>
      <style>
        body { 
          font-family: 'Georgia', serif; 
          max-width: 800px; 
          margin: 0 auto; 
          padding: 20px;
          background: linear-gradient(135deg, #1e1e2e, #2d2d42);
          color: #f8f8f2;
          line-height: 1.6;
        }
        .container { 
          background: rgba(30, 30, 46, 0.8);
          padding: 40px;
          border-radius: 15px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.3);
        }
        h1 { 
          color: #bd93f9; 
          text-align: center; 
          font-size: 2.5rem;
          margin-bottom: 10px;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
        .subtitle {
          text-align: center;
          color: #8be9fd;
          font-style: italic;
          margin-bottom: 30px;
        }
        .question-area {
          min-height: 400px;
          margin: 30px 0;
        }
        .question {
          background: rgba(68, 71, 90, 0.5);
          padding: 25px;
          border-radius: 10px;
          margin: 20px 0;
          border-left: 4px solid #bd93f9;
        }
        .location {
          color: #f1fa8c;
          font-weight: bold;
          font-size: 1.1rem;
          margin-bottom: 15px;
        }
        .vignette {
          color: #f8f8f2;
          font-size: 1.1rem;
          margin-bottom: 20px;
          font-style: italic;
        }
        .statement {
          color: #f8f8f2;
          font-size: 1.1rem;
          margin-bottom: 20px;
          quotes: '"' '"';
        }
        .statement:before { content: open-quote; }
        .statement:after { content: close-quote; }
        .options {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .option {
          background: rgba(40, 42, 54, 0.7);
          padding: 15px;
          border-radius: 8px;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.3s ease;
        }
        .option:hover {
          background: rgba(98, 114, 164, 0.3);
          border-color: #6272a4;
        }
        .option.selected-best {
          border-color: #50fa7b;
          background: rgba(80, 250, 123, 0.2);
        }
        .option.selected-worst {
          border-color: #ff5555;
          background: rgba(255, 85, 85, 0.2);
        }
        .likert-scale {
          display: flex;
          justify-content: space-between;
          margin: 20px 0;
        }
        .likert-option {
          flex: 1;
          text-align: center;
          padding: 15px 10px;
          background: rgba(40, 42, 54, 0.7);
          margin: 0 5px;
          border-radius: 8px;
          cursor: pointer;
          border: 2px solid transparent;
          transition: all 0.3s ease;
        }
        .likert-option:hover {
          background: rgba(98, 114, 164, 0.3);
          border-color: #6272a4;
        }
        .likert-option.selected {
          border-color: #bd93f9;
          background: rgba(189, 147, 249, 0.2);
        }
        button {
          background: linear-gradient(45deg, #bd93f9, #ff79c6);
          color: white;
          border: none;
          padding: 15px 30px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1.1rem;
          font-weight: bold;
          transition: all 0.3s ease;
          margin: 10px 5px;
        }
        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        }
        button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          transform: none;
        }
        .progress {
          background: rgba(40, 42, 54, 0.7);
          height: 8px;
          border-radius: 4px;
          margin: 20px 0;
          overflow: hidden;
        }
        .progress-bar {
          height: 100%;
          background: linear-gradient(90deg, #bd93f9, #ff79c6);
          transition: width 0.3s ease;
        }
        .controls {
          text-align: center;
          margin: 30px 0;
        }
        .result {
          text-align: center;
          padding: 40px;
          background: rgba(40, 42, 54, 0.7);
          border-radius: 15px;
          margin: 20px 0;
        }
        .ea-id {
          font-size: 3rem;
          color: #50fa7b;
          margin: 20px 0;
          text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
        }
        .color-swatch {
          width: 100px;
          height: 100px;
          border-radius: 50%;
          margin: 20px auto;
          box-shadow: 0 0 20px rgba(0,0,0,0.3);
        }
        .hidden { display: none; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🌟 Epic Arcana Assessment 🌟</h1>
        <p class="subtitle">Discover your unique place among the 360 archetypes of Laurasia</p>
        
        <div id="intro-screen">
          <p style="text-align: center; font-size: 1.2rem; margin: 40px 0;">
            Journey through the mystical realm of Laurasia and uncover your Epic Arcana profile. 
            This assessment combines story-driven scenarios with personal reflection to map your 
            personality to one of 360 unique archetypes.
          </p>
          <div class="controls">
            <button onclick="startAssessment()">Begin Your Journey</button>
          </div>
        </div>

        <div id="assessment-screen" class="hidden">
          <div class="progress">
            <div class="progress-bar" id="progress-bar"></div>
          </div>
          
          <div class="question-area" id="question-area"></div>
          
          <div class="controls">
            <button id="prev-btn" onclick="previousQuestion()" disabled>Previous</button>
            <button id="next-btn" onclick="nextQuestion()" disabled>Next</button>
            <button id="submit-btn" onclick="submitAssessment()" class="hidden">Complete Assessment</button>
          </div>
        </div>

        <div id="result-screen" class="hidden">
          <div class="result">
            <h2>Your Epic Arcana Profile</h2>
            <div class="ea-id" id="ea-id"></div>
            <div class="color-swatch" id="color-swatch"></div>
            <div id="result-details"></div>
            <div class="controls">
              <button onclick="downloadReport()">Download Report</button>
              <button onclick="location.reload()">Take Again</button>
            </div>
          </div>
        </div>
      </div>

      <script>
        let currentQuestion = 0;
        let assessmentData = null;
        let answers = {
          forcedChoice: [],
          likert: []
        };
        let assessmentStartTime = null;

        async function startAssessment() {
          try {
            const response = await fetch('/api/assessment-data');
            assessmentData = await response.json();
            
            document.getElementById('intro-screen').classList.add('hidden');
            document.getElementById('assessment-screen').classList.remove('hidden');
            
            assessmentStartTime = new Date().toISOString();
            showQuestion();
          } catch (error) {
            alert('Error loading assessment: ' + error.message);
          }
        }

        function showQuestion() {
          const totalQuestions = assessmentData.forcedChoice.length + assessmentData.likert.length;
          const progress = (currentQuestion / totalQuestions) * 100;
          document.getElementById('progress-bar').style.width = progress + '%';

          const questionArea = document.getElementById('question-area');
          
          if (currentQuestion < assessmentData.forcedChoice.length) {
            // Forced choice question
            const item = assessmentData.forcedChoice[currentQuestion];
            questionArea.innerHTML = \`
              <div class="question">
                <div class="location">\${item.location}</div>
                <div class="vignette">\${item.vignette}</div>
                <p><strong>Choose the option that MOST appeals to you and the option that LEAST appeals to you:</strong></p>
                <div class="options">
                  \${item.options.map((option, index) => 
                    \`<div class="option" data-index="\${index}" onclick="selectOption(\${index})">\${option.label}</div>\`
                  ).join('')}
                </div>
              </div>
            \`;
          } else {
            // Likert question  
            const itemIndex = currentQuestion - assessmentData.forcedChoice.length;
            const item = assessmentData.likert[itemIndex];
            questionArea.innerHTML = \`
              <div class="question">
                <div class="location">\${item.location}</div>
                <div class="statement">\${item.statement}</div>
                <div class="likert-scale">
                  <div class="likert-option" data-rating="1" onclick="selectLikert(1)">
                    <div>1</div>
                    <small>Strongly Disagree</small>
                  </div>
                  <div class="likert-option" data-rating="2" onclick="selectLikert(2)">
                    <div>2</div>
                    <small>Disagree</small>
                  </div>
                  <div class="likert-option" data-rating="3" onclick="selectLikert(3)">
                    <div>3</div>
                    <small>Neutral</small>
                  </div>
                  <div class="likert-option" data-rating="4" onclick="selectLikert(4)">
                    <div>4</div>
                    <small>Agree</small>
                  </div>
                  <div class="likert-option" data-rating="5" onclick="selectLikert(5)">
                    <div>5</div>
                    <small>Strongly Agree</small>
                  </div>
                </div>
              </div>
            \`;
          }

          updateButtons();
        }

        let selectedBest = null;
        let selectedWorst = null;
        let selectedLikert = null;

        function selectOption(index) {
          const options = document.querySelectorAll('.option');
          
          if (selectedBest === index) {
            // Deselect best
            options[index].classList.remove('selected-best');
            selectedBest = null;
          } else if (selectedWorst === index) {
            // Deselect worst
            options[index].classList.remove('selected-worst');
            selectedWorst = null;
          } else if (selectedBest === null) {
            // Select as best
            options[index].classList.add('selected-best');
            selectedBest = index;
          } else if (selectedWorst === null && index !== selectedBest) {
            // Select as worst
            options[index].classList.add('selected-worst');
            selectedWorst = index;
          }
          
          updateButtons();
        }

        function selectLikert(rating) {
          const options = document.querySelectorAll('.likert-option');
          options.forEach(opt => opt.classList.remove('selected'));
          
          const selected = document.querySelector(\`[data-rating="\${rating}"]\`);
          selected.classList.add('selected');
          selectedLikert = rating;
          
          updateButtons();
        }

        function updateButtons() {
          const totalQuestions = assessmentData ? assessmentData.forcedChoice.length + assessmentData.likert.length : 0;
          
          document.getElementById('prev-btn').disabled = currentQuestion === 0;
          
          let canProceed = false;
          if (currentQuestion < assessmentData.forcedChoice.length) {
            canProceed = selectedBest !== null && selectedWorst !== null;
          } else {
            canProceed = selectedLikert !== null;
          }
          
          if (currentQuestion === totalQuestions - 1) {
            document.getElementById('next-btn').classList.add('hidden');
            document.getElementById('submit-btn').classList.remove('hidden');
            document.getElementById('submit-btn').disabled = !canProceed;
          } else {
            document.getElementById('next-btn').classList.remove('hidden');
            document.getElementById('submit-btn').classList.add('hidden');
            document.getElementById('next-btn').disabled = !canProceed;
          }
        }

        function nextQuestion() {
          // Save current answer
          if (currentQuestion < assessmentData.forcedChoice.length) {
            answers.forcedChoice[currentQuestion] = {
              itemId: assessmentData.forcedChoice[currentQuestion].id,
              best: selectedBest,
              worst: selectedWorst
            };
          } else {
            const itemIndex = currentQuestion - assessmentData.forcedChoice.length;
            answers.likert[itemIndex] = {
              itemId: assessmentData.likert[itemIndex].id,
              rating: selectedLikert
            };
          }

          currentQuestion++;
          selectedBest = null;
          selectedWorst = null;
          selectedLikert = null;
          
          showQuestion();
        }

        function previousQuestion() {
          if (currentQuestion > 0) {
            currentQuestion--;
            selectedBest = null;
            selectedWorst = null;
            selectedLikert = null;
            showQuestion();
          }
        }

        async function submitAssessment() {
          // Save last answer
          if (currentQuestion < assessmentData.forcedChoice.length) {
            answers.forcedChoice[currentQuestion] = {
              itemId: assessmentData.forcedChoice[currentQuestion].id,
              best: selectedBest,
              worst: selectedWorst
            };
          } else {
            const itemIndex = currentQuestion - assessmentData.forcedChoice.length;
            answers.likert[itemIndex] = {
              itemId: assessmentData.likert[itemIndex].id,
              rating: selectedLikert
            };
          }

          const submissionData = {
            forcedChoice: answers.forcedChoice,
            likert: answers.likert,
            meta: {
              startTime: assessmentStartTime,
              endTime: new Date().toISOString(),
              userAgent: navigator.userAgent
            }
          };

          try {
            const response = await fetch('/api/submit', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(submissionData)
            });
            
            const result = await response.json();
            showResults(result);
          } catch (error) {
            alert('Error submitting assessment: ' + error.message);
          }
        }

        function showResults(result) {
          document.getElementById('assessment-screen').classList.add('hidden');
          document.getElementById('result-screen').classList.remove('hidden');
          
          document.getElementById('ea-id').textContent = result.ea_id;
          document.getElementById('color-swatch').style.backgroundColor = result.color.rgb_hex;
          
          const details = \`
            <p><strong>Chapter:</strong> \${result.chapter}</p>
            <p><strong>Dominant Type:</strong> \${result.dominant_type}</p>
            <p><strong>Color:</strong> \${result.color.rgb_hex}</p>
            <p><strong>Wing:</strong> Bin \${result.wing_bin}</p>
            <p><strong>Development:</strong> Bin \${result.development_bin}</p>
            <p><strong>Instinct Stack:</strong> \${getInstinctStack(result.instincts)}</p>
          \`;
          document.getElementById('result-details').innerHTML = details;
          
          window.currentResult = result;
        }

        function getInstinctStack(instincts) {
          return Object.entries(instincts)
            .sort(([,a], [,b]) => b - a)
            .map(([key]) => key)
            .join(' > ');
        }

        async function downloadReport() {
          if (window.currentResult) {
            const response = await fetch('/api/report', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(window.currentResult)
            });
            
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = \`epic_arcana_\${window.currentResult.ea_id}.md\`;
            a.click();
            URL.revokeObjectURL(url);
          }
        }
      </script>
    </body>
    </html>
  `);
});

// API endpoints
app.get('/api/assessment-data', (req, res) => {
  const forcedChoiceItems = getForcedChoiceItems();
  const likertItems = getLikertItems();
  
  res.json({
    forcedChoice: forcedChoiceItems,
    likert: likertItems
  });
});

app.post('/api/submit', async (req, res) => {
  try {
    const answers = AssessmentAnswersSchema.parse(req.body);
    const forcedChoiceItems = getForcedChoiceItems();
    const likertItems = getLikertItems();
    
    const result = await scoreAssessment(answers, forcedChoiceItems, likertItems);
    
    // Generate unique ID for this session
    const sessionId = Math.random().toString(36).substring(2, 15);
    await buildReport(result, sessionId);
    
    res.json(result);
  } catch (error) {
    console.error('Error processing assessment:', error);
    res.status(400).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
});

app.post('/api/report', async (req, res) => {
  try {
    const result = req.body;
    const sessionId = Math.random().toString(36).substring(2, 15);
    const { markdownPath } = await buildReport(result, sessionId);
    
    res.download(markdownPath);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

export function startServer() {
  app.listen(PORT, () => {
    console.log(`🌟 LSA Assessment server running on http://localhost:${PORT}`);
    console.log('📊 Ready to serve Epic Arcana assessments!');
  });
}