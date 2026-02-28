# 📖 How to Use the Grants Chatbot - Quick Guide

## 🎯 What Can the Chatbot Do?

The enhanced grants chatbot helps you:
1. **Discover** grants through intelligent Q&A
2. **Match** your school with the most relevant grants
3. **Apply** with step-by-step guidance
4. **Learn** about GJTS schools, admissions, courses, etc.

## 🚀 Quick Start Guide

### Step 1: Access the Grants Page

1. Login to dashboard: http://localhost:3000/dashboard/login
   - Username: `superadmin`
   - Password: `super123`

2. Click on **"Grants Discovery"** from the dashboard

### Step 2: Start a Conversation

In the chat interface, you can ask:

#### For Grant Discovery:
```
"Help me choose a grant"
"What grants are available?"
"Which grant should I apply for?"
"Find grants for my school"
```

#### For Application Help:
```
"How do I apply for grants?"
"What documents do I need?"
"How do I apply for Digital Education Grant?"
```

#### For General Information:
```
"Tell me about GJTS schools"
"What courses are offered?"
"How do I apply for admission?"
"What are the placement rates?"
```

## 💬 Example Conversation Flow

### Scenario: Finding the Right Grant

**You:** "Help me choose a grant"

**Bot:** 
```
🎯 I can help you find the perfect grant for your school! 
Let me ask you a few questions to recommend the best grants:

Question 1 of 5: What is your school's primary need right now?

A) 🏗️ Infrastructure (buildings, classrooms, furniture)
B) 💻 Digital/Technology (computers, internet, smart classrooms)
C) 🔬 Laboratory Equipment (science labs, equipment)
D) 📚 Library & Learning Resources
E) 🏃 Sports Facilities
F) 👨‍🏫 Teacher Training & Development
G) ♿ Inclusive Education (special needs support)
H) 🎓 Vocational/Skill Development

Please reply with the letter (A-H) or describe your need.
```

**You:** "B"

**Bot:**
```
Great! You need support for Digital Infrastructure.

Question 2 of 5: What is your school's current student enrollment?

A) Less than 100 students
B) 100-250 students
C) 250-500 students
D) 500-1000 students
E) More than 1000 students

Please reply with the letter (A-E) or the approximate number.
```

**You:** "C"

**Bot:**
```
Noted! Your school has approximately 375 students.

Question 3 of 5: What is your estimated budget requirement?

A) 💰 Rs 10,000 - Rs 1 lakh (Small maintenance/supplies)
B) 💰 Rs 1-5 lakh (Minor upgrades)
C) 💰 Rs 5-15 lakh (Significant improvements)
D) 💰 Rs 15-50 lakh (Major infrastructure)
E) 💰 Rs 50 lakh+ (Comprehensive development)

Please reply with the letter (A-E).
```

**You:** "C"

**Bot:**
```
Perfect! Budget requirement noted.

Question 4 of 5: Does your school have the following?

A) ✅ All basic infrastructure (building, electricity, water)
B) ⚠️ Some infrastructure gaps
C) ❌ Significant infrastructure needs

Please reply with the letter (A-C).
```

**You:** "A"

**Bot:**
```
Thank you! Last question...

Question 5 of 5: When do you need the funding?

A) 🚨 Urgent (within 1-2 months)
B) ⏰ Soon (within 3-6 months)
C) 📅 Planning ahead (6-12 months)

Please reply with the letter (A-C).
```

**You:** "B"

**Bot:**
```
🎯 Perfect! Based on your answers, here are the TOP 3 GRANTS recommended:

1. Digital Education Infrastructure Grant (85% match)
   💰 Amount: Rs 5-15 lakh per school
   🏛️ Provider: Ministry of Education & IT
   📅 Deadline: Q1 2026
   ✅ Why this matches:
      • Perfect match for Digital Infrastructure
      • Budget aligns with your requirement
      • Your enrollment meets typical requirements
      • Sufficient time to apply (90 days)

2. Samagra Shiksha Abhiyan (70% match)
   💰 Amount: Rs 2,94,283 crore
   🏛️ Provider: Ministry of Education, Government of India
   📅 Deadline: 2025-26 (ongoing)
   ✅ Why this matches:
      • Covers infrastructure, teacher training, digital education
      • Budget aligns with your requirement
      • Your enrollment meets typical requirements

3. PM SHRI Schools (65% match)
   💰 Amount: Rs 27,360 crore
   🏛️ Provider: Ministry of Education, Government of India
   📅 Deadline: Rolling applications
   ✅ Why this matches:
      • Transform schools into model institutions
      • Your enrollment meets typical requirements
      • Sufficient time to apply

📋 Next Steps:
1. Review Details: Check the full grant details in your dashboard
2. Prepare Documents: Gather required documents
3. Apply Online: Visit the official portal links provided
4. Track Application: Keep your reference number

💡 Need help with application? Ask me "How do I apply for [grant name]?"

🔗 Visit your Grants Discovery page to see all details and application links.
```

## 📊 Understanding Match Scores

The chatbot scores grants based on:
- **Category Match (40%)**: How well the grant matches your primary need
- **Budget Compatibility (30%)**: If grant amount fits your requirement
- **Enrollment Requirements (15%)**: If your student count meets criteria
- **Timeline Feasibility (15%)**: If deadline allows sufficient time

**Higher score = Better match for your school!**

## 🎓 Other Useful Commands

### List All Grants:
```
"What grants are available?"
"List all grants"
"Show me all funding options"
```

### Application Process:
```
"How do I apply for grants?"
"What is the application process?"
"What documents do I need?"
```

### Specific Grant Info:
```
"Tell me about Samagra Shiksha"
"What is PM SHRI Schools?"
"Digital Education Grant details"
```

### GJTS Information:
```
"List all GJTS schools"
"Tell me about GJTS Hubballi"
"What courses are offered?"
"Admission process"
"Scholarship information"
"Placement rates"
"Alumni success stories"
```

## 💡 Pro Tips

1. **Be Specific**: The more specific your answers, the better the recommendations
2. **Ask Follow-ups**: After getting recommendations, ask about specific grants
3. **Check Deadlines**: Always verify deadlines on official portals
4. **Save Recommendations**: Click on grants in the sidebar to see full details
5. **Multiple Needs**: You can run the questionnaire multiple times for different needs

## 🔗 Quick Links

- **Dashboard**: http://localhost:3000/dashboard
- **Grants Discovery**: http://localhost:3000/dashboard/grants
- **Funds Management**: http://localhost:3000/dashboard/funds
- **Alumni Management**: http://localhost:3000/dashboard/alumni

## 📞 Need Help?

If you encounter any issues:
1. Refresh the page
2. Clear browser cache
3. Check server is running: `npm run dev`
4. Check MongoDB connection in `.env`

## 🎉 Success Stories

### Example Use Cases:

**Case 1: Small School Needs Computers**
- Need: Digital Infrastructure
- Enrollment: 150 students
- Budget: Rs 5-10 lakh
- **Result**: Matched with Digital Education Infrastructure Grant (90% match)

**Case 2: Large School Needs Sports Facilities**
- Need: Sports Infrastructure
- Enrollment: 800 students
- Budget: Rs 15-20 lakh
- **Result**: Matched with Sports Infrastructure Development Grant (88% match)

**Case 3: School Needs Teacher Training**
- Need: Teacher Development
- Enrollment: 300 students
- Budget: Rs 2-4 lakh
- **Result**: Matched with Teacher Training & Professional Development (92% match)

## ✨ What Makes This Special?

Unlike traditional grant search:
- ❌ No manual searching through hundreds of grants
- ❌ No confusion about eligibility
- ❌ No guessing which grant to apply for

With AI Chatbot:
- ✅ 5 simple questions
- ✅ Personalized recommendations
- ✅ Clear match scores and reasons
- ✅ Direct application links
- ✅ Step-by-step guidance

**Save hours of research time and increase your success rate!**

---

**Ready to find your perfect grant? Start chatting now!** 🚀
