// Sample data and configuration
const SAMPLE_DATA = {
  "sample_users": {
    "student": {
      "name": "Alex Chen",
      "age": 20,
      "occupation": "College Student",
      "income": 1200,
      "experience": "Beginner",
      "monthly_budget": {
        "income": 1200,
        "expenses": {
          "housing": 400,
          "food": 300,
          "transportation": 100,
          "textbooks": 150,
          "entertainment": 120,
          "savings": 130
        }
      },
      "spending_patterns": [
        {"month": "Jan", "food": 280, "entertainment": 140, "textbooks": 200},
        {"month": "Feb", "food": 320, "entertainment": 100, "textbooks": 50},
        {"month": "Mar", "food": 310, "entertainment": 150, "textbooks": 180}
      ]
    },
    "professional": {
      "name": "Sarah Johnson",
      "age": 28,
      "occupation": "Software Engineer",
      "income": 7500,
      "experience": "Intermediate",
      "monthly_budget": {
        "income": 7500,
        "expenses": {
          "housing": 2200,
          "food": 600,
          "transportation": 400,
          "insurance": 300,
          "entertainment": 500,
          "investments": 1500,
          "savings": 2000
        }
      },
      "spending_patterns": [
        {"month": "Jan", "food": 580, "entertainment": 520, "investments": 1500},
        {"month": "Feb", "food": 620, "entertainment": 480, "investments": 1600},
        {"month": "Mar", "food": 610, "entertainment": 510, "investments": 1450}
      ]
    }
  },
  "financial_advice": {
    "student": {
      "budgeting": "Hey! 💡 Let's break down budgeting in simple terms. Think of it like managing your monthly allowance or part-time job income. The 50/30/20 rule is perfect for students: 50% for needs (housing, food), 30% for wants (entertainment, going out), and 20% for savings (even if it's just $50/month). Every dollar saved now grows into many more later!",
      "saving": "Starting small is totally fine! Even $25-50 per month adds up. Try the 'pay yourself first' approach - set aside savings as soon as you get paid, before spending on anything else. Consider high-yield savings accounts or student-friendly investment apps. Remember, building the habit matters more than the amount right now.",
      "credit": "Building credit as a student is super important! Start with a student credit card, use it for small purchases like gas or groceries, and ALWAYS pay the full balance on time. Never spend more than 30% of your credit limit. This builds your credit score for future apartment rentals and loans.",
      "debt": "Student loans can feel overwhelming, but you've got this! Focus on understanding your loan terms first. While in school, try to pay interest if possible to prevent capitalization. After graduation, consider income-driven repayment plans if needed. Don't let student debt stop you from living - just be strategic about it."
    },
    "professional": {
      "budgeting": "A sophisticated budgeting approach involves zero-based budgeting where every dollar has a designated purpose. Consider the 70/20/10 allocation: 70% for living expenses, 20% for investments and retirement, 10% for discretionary spending. Implement automated transfers and utilize multiple savings accounts for different financial goals to maximize efficiency.",
      "investing": "Given your income level, focus on maximizing tax-advantaged accounts first: contribute enough to your 401(k) to get the full company match, then maximize your Roth IRA ($6,500 for 2023). Consider a diversified portfolio with low-cost index funds. For additional investments, evaluate your risk tolerance and time horizon for appropriate asset allocation.",
      "retirement": "At your career stage, time is your greatest asset for compound growth. Aim to save 10-15% of your gross income for retirement. If your employer offers a 401(k) match, prioritize that first - it's free money. Consider increasing your contribution rate by 1% annually. A target-date fund can provide appropriate diversification as you build wealth.",
      "tax_optimization": "Explore tax-efficient investment strategies such as municipal bonds if you're in a high tax bracket, maximize contributions to HSAs if available (triple tax advantage), and consider tax-loss harvesting in taxable accounts. Evaluate whether traditional or Roth retirement accounts are more beneficial based on your current and expected future tax rates."
    }
  },
  "spending_insights": {
    "common_categories": ["housing", "food", "transportation", "entertainment", "insurance", "savings", "investments"],
    "optimization_tips": {
      "food": "Track spending for a week, meal prep on Sundays, use grocery store apps for discounts, consider generic brands",
      "entertainment": "Look for student/professional discounts, try free local events, set a monthly entertainment budget limit",
      "transportation": "Compare public transit vs driving costs, consider carpooling, optimize insurance coverage",
      "housing": "Negotiate rent annually, consider roommates, optimize utilities usage"
    }
  }
};

// Application state
let userProfile = null;
let conversationHistory = [];
let budgetChart = null;
let spendingChart = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing app...');
  initializeApp();
  setupEventListeners();
});

function initializeApp() {
  console.log('Initializing app...');
  
  // Check if user profile exists in session
  const savedProfile = sessionStorage.getItem('userProfile');
  if (savedProfile) {
    try {
      userProfile = JSON.parse(savedProfile);
      console.log('Loaded saved profile:', userProfile);
      updateUIWithProfile();
      generateInsights();
      updateCharts();
    } catch (error) {
      console.error('Error parsing saved profile:', error);
      sessionStorage.removeItem('userProfile');
    }
  }
  
  // Add initial bot message
  if (conversationHistory.length === 0) {
    addWelcomeMessage();
  }
}

function setupEventListeners() {
  console.log('Setting up event listeners...');
  
  // Get DOM elements
  const profileModal = document.getElementById('profileModal');
  const profileForm = document.getElementById('profileForm');
  const profileBtn = document.getElementById('profileBtn');
  const setupProfileBtn = document.getElementById('setupProfileBtn');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const cancelProfileBtn = document.getElementById('cancelProfileBtn');
  const chatMessages = document.getElementById('chatMessages');
  const messageInput = document.getElementById('messageInput');
  const sendBtn = document.getElementById('sendBtn');
  const clearChatBtn = document.getElementById('clearChatBtn');
  const budgetSummaryBtn = document.getElementById('budgetSummaryBtn');
  const spendingAnalysisBtn = document.getElementById('spendingAnalysisBtn');
  const investmentAdviceBtn = document.getElementById('investmentAdviceBtn');
  const savingsGoalBtn = document.getElementById('savingsGoalBtn');
  
  // Profile modal events
  if (profileBtn) {
    profileBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Profile button clicked');
      openProfileModal();
    });
  }
  
  if (setupProfileBtn) {
    setupProfileBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Setup profile button clicked');
      openProfileModal();
    });
  }
  
  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Close modal button clicked');
      closeProfileModal();
    });
  }
  
  if (cancelProfileBtn) {
    cancelProfileBtn.addEventListener('click', function(e) {
      e.preventDefault();
      console.log('Cancel profile button clicked');
      closeProfileModal();
    });
  }
  
  if (profileForm) {
    profileForm.addEventListener('submit', function(e) {
      e.preventDefault();
      console.log('Profile form submitted');
      handleProfileSubmit(e);
    });
  }
  
  // Chat events
  if (sendBtn) {
    sendBtn.addEventListener('click', function(e) {
      e.preventDefault();
      handleSendMessage();
    });
  }
  
  if (messageInput) {
    messageInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleSendMessage();
      }
    });
  }
  
  if (clearChatBtn) {
    clearChatBtn.addEventListener('click', function(e) {
      e.preventDefault();
      clearChat();
    });
  }
  
  // Quick action events
  if (budgetSummaryBtn) {
    budgetSummaryBtn.addEventListener('click', function(e) {
      e.preventDefault();
      handleQuickAction('budget');
    });
  }
  
  if (spendingAnalysisBtn) {
    spendingAnalysisBtn.addEventListener('click', function(e) {
      e.preventDefault();
      handleQuickAction('spending');
    });
  }
  
  if (investmentAdviceBtn) {
    investmentAdviceBtn.addEventListener('click', function(e) {
      e.preventDefault();
      handleQuickAction('investment');
    });
  }
  
  if (savingsGoalBtn) {
    savingsGoalBtn.addEventListener('click', function(e) {
      e.preventDefault();
      handleQuickAction('savings');
    });
  }
  
  // Suggestion buttons
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('suggestion-btn')) {
      const message = e.target.dataset.message;
      if (messageInput) {
        messageInput.value = message;
        handleSendMessage();
      }
    }
  });
  
  // Modal backdrop click to close
  if (profileModal) {
    profileModal.addEventListener('click', function(e) {
      if (e.target === profileModal || e.target.classList.contains('modal-backdrop')) {
        closeProfileModal();
      }
    });
  }
  
  console.log('Event listeners set up complete');
}

function openProfileModal() {
  console.log('Opening profile modal...');
  const profileModal = document.getElementById('profileModal');
  if (profileModal) {
    profileModal.classList.remove('hidden');
    console.log('Profile modal opened');
    if (userProfile) {
      populateProfileForm();
    }
  } else {
    console.error('Profile modal element not found');
  }
}

function closeProfileModal() {
  console.log('Closing profile modal...');
  const profileModal = document.getElementById('profileModal');
  const profileForm = document.getElementById('profileForm');
  
  if (profileModal) {
    profileModal.classList.add('hidden');
    console.log('Profile modal closed');
  }
  
  if (profileForm) {
    profileForm.reset();
  }
}

function populateProfileForm() {
  if (!userProfile) return;
  
  console.log('Populating profile form with:', userProfile);
  
  const userName = document.getElementById('userName');
  const userAge = document.getElementById('userAge');
  const userOccupation = document.getElementById('userOccupation');
  const monthlyIncomeInput = document.getElementById('monthlyIncomeInput');
  const financialExperience = document.getElementById('financialExperience');
  const financialGoals = document.getElementById('financialGoals');
  
  if (userName) userName.value = userProfile.name || '';
  if (userAge) userAge.value = userProfile.age || '';
  if (userOccupation) userOccupation.value = userProfile.occupation || '';
  if (monthlyIncomeInput) monthlyIncomeInput.value = userProfile.income || '';
  if (financialExperience) financialExperience.value = userProfile.experience || '';
  if (financialGoals) financialGoals.value = userProfile.goals || '';
}

function handleProfileSubmit(e) {
  e.preventDefault();
  console.log('Handling profile submit...');
  
  const name = document.getElementById('userName').value;
  const age = parseInt(document.getElementById('userAge').value);
  const occupation = document.getElementById('userOccupation').value;
  const income = parseFloat(document.getElementById('monthlyIncomeInput').value);
  const experience = document.getElementById('financialExperience').value;
  const goals = document.getElementById('financialGoals').value;
  
  console.log('Form data:', { name, age, occupation, income, experience, goals });
  
  // Validate required fields
  if (!name || !age || !occupation || !income || !experience || !goals) {
    alert('Please fill in all required fields.');
    return;
  }
  
  // Determine user type based on occupation and age
  const userType = determineUserType(occupation, age, income);
  console.log('Determined user type:', userType);
  
  // Create user profile
  userProfile = {
    name,
    age,
    occupation,
    income,
    experience,
    goals,
    type: userType,
    budget: generateBudgetData(userType, income),
    createdAt: new Date().toISOString()
  };
  
  console.log('Created user profile:', userProfile);
  
  // Save to session storage
  try {
    sessionStorage.setItem('userProfile', JSON.stringify(userProfile));
    console.log('Profile saved to session storage');
  } catch (error) {
    console.error('Error saving profile:', error);
  }
  
  // Update UI
  updateUIWithProfile();
  generateInsights();
  updateCharts();
  
  // Close modal
  closeProfileModal();
  
  // Add welcome message based on user type
  addPersonalizedWelcomeMessage();
}

function determineUserType(occupation, age, income) {
  if (occupation === 'student' || age < 23 || income < 2000) {
    return 'student';
  }
  return 'professional';
}

function generateBudgetData(userType, income) {
  if (userType === 'student') {
    // Student budget allocation
    return {
      income: income,
      expenses: {
        housing: Math.round(income * 0.33),
        food: Math.round(income * 0.25),
        transportation: Math.round(income * 0.08),
        textbooks: Math.round(income * 0.12),
        entertainment: Math.round(income * 0.10),
        savings: Math.round(income * 0.12)
      }
    };
  } else {
    // Professional budget allocation
    return {
      income: income,
      expenses: {
        housing: Math.round(income * 0.30),
        food: Math.round(income * 0.08),
        transportation: Math.round(income * 0.05),
        insurance: Math.round(income * 0.04),
        entertainment: Math.round(income * 0.07),
        investments: Math.round(income * 0.20),
        savings: Math.round(income * 0.26)
      }
    };
  }
}

function updateUIWithProfile() {
  if (!userProfile) return;
  
  console.log('Updating UI with profile:', userProfile);
  
  // Update greeting
  const userGreeting = document.getElementById('userGreeting');
  const profileBtn = document.getElementById('profileBtn');
  
  if (userGreeting) {
    const userTypeBadge = `<span class="user-type-badge ${userProfile.type}">${userProfile.type}</span>`;
    userGreeting.innerHTML = `Hello, ${userProfile.name}! ${userTypeBadge}`;
  }
  
  // Update profile button
  if (profileBtn) {
    profileBtn.textContent = 'Edit Profile';
  }
  
  // Update profile summary
  const profileSummary = document.getElementById('profileSummary');
  if (profileSummary) {
    const profileHtml = `
      <div class="profile-details">
        <p><strong>${userProfile.name}</strong></p>
        <p>Age: ${userProfile.age} • ${userProfile.occupation}</p>
        <p>Experience: ${userProfile.experience}</p>
        <p>Goal: ${userProfile.goals.charAt(0).toUpperCase() + userProfile.goals.slice(1)}</p>
      </div>
      <button class="btn btn--primary btn--sm" id="editProfileBtn">Edit Profile</button>
    `;
    profileSummary.innerHTML = profileHtml;
    profileSummary.classList.add('complete');
    
    // Add click listener to edit profile button
    const editProfileBtn = document.getElementById('editProfileBtn');
    if (editProfileBtn) {
      editProfileBtn.addEventListener('click', function(e) {
        e.preventDefault();
        openProfileModal();
      });
    }
  }
  
  // Update financial metrics
  const monthlyIncome = document.getElementById('monthlyIncome');
  const totalExpenses = document.getElementById('totalExpenses');
  const savingsRate = document.getElementById('savingsRate');
  
  if (monthlyIncome && totalExpenses && savingsRate) {
    const totalExpensesValue = Object.values(userProfile.budget.expenses).reduce((sum, val) => sum + val, 0);
    const savingsAmount = userProfile.budget.expenses.savings || 0;
    const savingsRateValue = ((savingsAmount / userProfile.income) * 100).toFixed(1);
    
    monthlyIncome.textContent = `$${userProfile.income.toLocaleString()}`;
    totalExpenses.textContent = `$${totalExpensesValue.toLocaleString()}`;
    savingsRate.textContent = `${savingsRateValue}%`;
  }
}

function addWelcomeMessage() {
  const message = {
    type: 'assistant',
    content: `Hello! I'm your AI-powered personal finance assistant. I'm here to help you with budgeting, investments, savings, and all your financial questions.

To provide you with personalized advice, please set up your profile first. I'll adapt my responses based on whether you're a student or a working professional.`,
    timestamp: new Date()
  };
  
  addMessageToChat(message);
}

function addPersonalizedWelcomeMessage() {
  if (!userProfile) return;
  
  const tone = userProfile.type === 'student' ? 'casual' : 'professional';
  let content = '';
  
  if (userProfile.type === 'student') {
    content = `Hey ${userProfile.name}! 👋 Awesome to meet you! I can see you're a ${userProfile.occupation.toLowerCase()} - that's such an exciting time to start building good financial habits! 

I'm here to help you navigate money management in a way that makes sense for your lifestyle. Whether you want to stretch your budget further, start building credit, or just figure out this whole "adulting with money" thing, I've got your back! 

What would you like to talk about first? 💰`;
  } else {
    content = `Welcome, ${userProfile.name}. It's a pleasure to assist you with your financial planning needs.

As a ${userProfile.occupation.toLowerCase()}, you're in an excellent position to build substantial wealth through strategic financial planning. I'll provide you with comprehensive analysis and sophisticated strategies tailored to your professional status and income level.

I'm equipped to help you with advanced investment strategies, tax optimization, retirement planning, and comprehensive portfolio management. How may I assist you today?`;
  }
  
  const message = {
    type: 'assistant',
    content: content,
    timestamp: new Date()
  };
  
  addMessageToChat(message);
}

function handleSendMessage() {
  const messageInput = document.getElementById('messageInput');
  if (!messageInput) return;
  
  const messageText = messageInput.value.trim();
  if (!messageText) return;
  
  console.log('Sending message:', messageText);
  
  // Add user message
  const userMessage = {
    type: 'user',
    content: messageText,
    timestamp: new Date()
  };
  
  addMessageToChat(userMessage);
  conversationHistory.push(userMessage);
  
  // Clear input
  messageInput.value = '';
  
  // Show loading
  showLoading();
  
  // Process message and generate response
  setTimeout(() => {
    const response = generateResponse(messageText);
    const assistantMessage = {
      type: 'assistant',
      content: response,
      timestamp: new Date()
    };
    
    addMessageToChat(assistantMessage);
    conversationHistory.push(assistantMessage);
    hideLoading();
  }, 1000 + Math.random() * 1000); // Simulate processing time
}

function generateResponse(message) {
  if (!userProfile) {
    return "I'd love to help you with that! However, I'll need to know more about your financial situation first. Please set up your profile so I can provide personalized advice that's right for you.";
  }
  
  const lowerMessage = message.toLowerCase();
  const userType = userProfile.type;
  const advice = SAMPLE_DATA.financial_advice[userType];
  
  // Intent recognition and response generation
  if (lowerMessage.includes('budget') || lowerMessage.includes('spending plan')) {
    return advice.budgeting;
  } else if (lowerMessage.includes('save') || lowerMessage.includes('savings') || lowerMessage.includes('emergency fund')) {
    return userType === 'student' ? advice.saving : 
      `Building wealth requires a systematic savings approach. I recommend maintaining 6 months of expenses in a high-yield savings account for emergencies, then focusing on tax-advantaged investments. Given your income of $${userProfile.income.toLocaleString()}, aim to save at least 20% monthly - that's approximately $${Math.round(userProfile.income * 0.2).toLocaleString()}.`;
  } else if (lowerMessage.includes('invest') || lowerMessage.includes('investment') || lowerMessage.includes('portfolio')) {
    return userType === 'professional' ? advice.investing : 
      `Great question! As a student, start simple: consider low-cost index funds or robo-advisors with small monthly contributions ($25-50). Focus on building the investing habit first. Once you graduate and increase your income, you can explore more sophisticated strategies. The key is starting early - even small amounts compound over time! 📈`;
  } else if (lowerMessage.includes('retire') || lowerMessage.includes('retirement')) {
    return userType === 'professional' ? advice.retirement :
      `Retirement might seem super far away, but starting to think about it now is brilliant! 🌟 Even contributing $25/month to a Roth IRA while you're a student can grow to hundreds of thousands by retirement thanks to compound interest. Start small, think long-term, and increase contributions as your income grows!`;
  } else if (lowerMessage.includes('debt') || lowerMessage.includes('loan') || lowerMessage.includes('credit')) {
    return userType === 'student' ? advice.credit : 
      `Debt management is crucial for wealth building. Prioritize high-interest debt first (credit cards), maintain good credit (keep utilization under 30%), and consider strategic debt like mortgages that can build equity. For student loans, evaluate refinancing options carefully, considering the loss of federal protections.`;
  } else if (lowerMessage.includes('tax') || lowerMessage.includes('taxes')) {
    return userType === 'professional' ? advice.tax_optimization :
      `Taxes as a student can be pretty straightforward! Make sure you're claiming education credits if eligible, and keep track of any work-related expenses. If you're working part-time, you might get most of your taxes back. Don't stress too much about complex tax strategies yet - focus on building good record-keeping habits! 📋`;
  } else {
    // General helpful response based on user type
    if (userType === 'student') {
      return `That's a great question! 🤔 As a college student, you're in such a good position to build strong financial habits. Whether it's about budgeting, saving, building credit, or planning for the future, I'm here to help break things down in ways that make sense for your situation. 

What specific area would you like to dive into? I can help with budgeting tips, savings strategies, or even just figuring out how to make your money stretch further! 💪`;
    } else {
      return `Thank you for that question. Given your professional background and income level, I can provide detailed analysis and strategic recommendations across various financial domains.

I specialize in comprehensive financial planning including investment portfolio optimization, tax-efficient strategies, retirement planning, and wealth accumulation techniques. Would you like me to focus on a specific area of your financial planning, or would you prefer a comprehensive analysis of your current financial position?`;
    }
  }
}

function handleQuickAction(action) {
  const messageInput = document.getElementById('messageInput');
  if (!messageInput) return;
  
  let message = '';
  
  switch(action) {
    case 'budget':
      message = 'Can you create a budget summary for me?';
      break;
    case 'spending':
      message = 'Please analyze my spending patterns and suggest improvements.';
      break;
    case 'investment':
      message = 'What are some good investment options for me?';
      break;
    case 'savings':
      message = 'How much should I be saving and what are some good strategies?';
      break;
  }
  
  messageInput.value = message;
  handleSendMessage();
}

function addMessageToChat(message) {
  const chatMessages = document.getElementById('chatMessages');
  if (!chatMessages) return;
  
  const messageDiv = document.createElement('div');
  messageDiv.className = `message ${message.type}-message new-message`;
  
  const timeString = message.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  
  messageDiv.innerHTML = `
    <div class="message-content">
      ${formatMessageContent(message.content)}
    </div>
    <div class="message-time">${timeString}</div>
  `;
  
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function formatMessageContent(content) {
  // Convert line breaks to paragraphs
  const paragraphs = content.split('\n\n').filter(p => p.trim());
  return paragraphs.map(p => `<p>${p}</p>`).join('');
}

function clearChat() {
  const chatMessages = document.getElementById('chatMessages');
  if (chatMessages) {
    chatMessages.innerHTML = '';
  }
  conversationHistory = [];
  addWelcomeMessage();
  if (userProfile) {
    addPersonalizedWelcomeMessage();
  }
}

function showLoading() {
  const loadingIndicator = document.getElementById('loadingIndicator');
  if (loadingIndicator) {
    loadingIndicator.classList.remove('hidden');
  }
}

function hideLoading() {
  const loadingIndicator = document.getElementById('loadingIndicator');
  if (loadingIndicator) {
    loadingIndicator.classList.add('hidden');
  }
}

function updateCharts() {
  if (!userProfile) return;
  
  updateBudgetChart();
  updateSpendingChart();
}

function updateBudgetChart() {
  const canvas = document.getElementById('budgetChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  if (budgetChart) {
    budgetChart.destroy();
  }
  
  const expenses = userProfile.budget.expenses;
  const labels = Object.keys(expenses).map(key => key.charAt(0).toUpperCase() + key.slice(1));
  const data = Object.values(expenses);
  const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#ECEBD5', '#5D878F', '#DB4545', '#D2BA4C', '#964325'];
  
  budgetChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors.slice(0, data.length),
        borderWidth: 1,
        borderColor: '#fff'
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 10,
            usePointStyle: true
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage = Math.round((context.parsed / total) * 100);
              return `${context.label}: $${context.parsed.toLocaleString()} (${percentage}%)`;
            }
          }
        }
      }
    }
  });
}

function updateSpendingChart() {
  const canvas = document.getElementById('spendingChart');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  
  if (spendingChart) {
    spendingChart.destroy();
  }
  
  // Use sample spending patterns based on user type
  const sampleData = SAMPLE_DATA.sample_users[userProfile.type].spending_patterns;
  const months = sampleData.map(item => item.month);
  
  // Get categories for this user type
  const categories = Object.keys(sampleData[0]).filter(key => key !== 'month');
  const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#5D878F', '#DB4545'];
  
  const datasets = categories.map((category, index) => ({
    label: category.charAt(0).toUpperCase() + category.slice(1),
    data: sampleData.map(item => item[category]),
    borderColor: colors[index % colors.length],
    backgroundColor: colors[index % colors.length] + '20',
    tension: 0.4
  }));
  
  spendingChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: months,
      datasets: datasets
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'bottom'
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`;
            }
          }
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: function(value) {
              return '$' + value.toLocaleString();
            }
          }
        }
      }
    }
  });
}

function generateInsights() {
  if (!userProfile) return;
  
  const expenses = userProfile.budget.expenses;
  const income = userProfile.income;
  const userType = userProfile.type;
  
  let insights = [];
  
  // Spending analysis
  const totalExpenses = Object.values(expenses).reduce((sum, val) => sum + val, 0);
  const savingsRate = ((expenses.savings || 0) / income) * 100;
  
  if (savingsRate < 10) {
    insights.push({
      icon: '⚠️',
      title: 'Low Savings Rate',
      description: userType === 'student' ? 
        'Try to save at least 10% of your income, even if it\'s just $50-100 per month!' :
        'Consider increasing your savings rate to at least 15-20% for optimal financial health.'
    });
  }
  
  // Category-specific insights
  const housingRatio = (expenses.housing / income) * 100;
  if (housingRatio > 33) {
    insights.push({
      icon: '🏠',
      title: 'High Housing Costs',
      description: userType === 'student' ?
        'Your housing costs are high. Consider finding roommates or cheaper accommodation to free up money for other goals.' :
        'Housing costs exceed 33% of income. Consider refinancing, relocating, or increasing income to optimize this ratio.'
    });
  }
  
  // Positive insights
  if (expenses.investments && expenses.investments > 0) {
    insights.push({
      icon: '📈',
      title: 'Great Investment Habits',
      description: 'You\'re already investing for the future - that puts you ahead of most people your age!'
    });
  }
  
  if (savingsRate >= 15) {
    insights.push({
      icon: '🎯',
      title: 'Excellent Savings Rate',
      description: userType === 'student' ?
        'Your savings rate is fantastic! You\'re building great habits that will pay off big time later.' :
        'Your savings rate demonstrates strong financial discipline. Consider maximizing tax-advantaged accounts next.'
    });
  }
  
  // General advice based on user type
  if (userType === 'student') {
    insights.push({
      icon: '💡',
      title: 'Student Tip',
      description: 'Focus on building an emergency fund of $1,000 first, then start investing small amounts regularly.'
    });
  } else {
    insights.push({
      icon: '💼',
      title: 'Professional Tip',
      description: 'Maximize your 401(k) match if available, then focus on Roth IRA contributions for tax diversification.'
    });
  }
  
  // Render insights
  renderInsights(insights);
}

function renderInsights(insights) {
  const insightsContainer = document.getElementById('insightsContainer');
  if (!insightsContainer) return;
  
  if (insights.length === 0) {
    insightsContainer.innerHTML = '<p class="text-secondary">No specific insights available at this time.</p>';
    return;
  }
  
  const insightsHtml = insights.map(insight => `
    <div class="insight-item">
      <div class="insight-icon">${insight.icon}</div>
      <div class="insight-content">
        <h4>${insight.title}</h4>
        <p>${insight.description}</p>
      </div>
    </div>
  `).join('');
  
  insightsContainer.innerHTML = insightsHtml;
}