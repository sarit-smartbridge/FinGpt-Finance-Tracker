from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import mm
from reportlab.platypus import BaseDocTemplate, Frame, PageTemplate, PageBreak, Paragraph, Spacer, Table, TableStyle

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "output" / "pdf" / "FinGPT_15_Minute_Panel_Explanation.pdf"
OUT.parent.mkdir(parents=True, exist_ok=True)

PAGE_W, PAGE_H = A4
NAVY = colors.HexColor("#123D3A")
TEAL = colors.HexColor("#0F766E")
MINT = colors.HexColor("#E8F4F1")
GOLD = colors.HexColor("#E3A72F")
INK = colors.HexColor("#23333A")
MUTED = colors.HexColor("#607176")


def decorate(canvas, doc):
    canvas.saveState()
    if doc.page == 1:
        canvas.setFillColor(NAVY)
        canvas.rect(0, PAGE_H - 21 * mm, PAGE_W, 21 * mm, fill=1, stroke=0)
        canvas.setFillColor(GOLD)
        canvas.rect(0, PAGE_H - 22.3 * mm, PAGE_W, 1.3 * mm, fill=1, stroke=0)
        canvas.setFillColor(colors.white)
        canvas.setFont("Helvetica-Bold", 10)
        canvas.drawString(17 * mm, PAGE_H - 13 * mm, "FinGPT | 15-Minute Panel Presentation")
    else:
        canvas.setStrokeColor(colors.HexColor("#C8DCD7"))
        canvas.line(17 * mm, PAGE_H - 14 * mm, PAGE_W - 17 * mm, PAGE_H - 14 * mm)
        canvas.setFillColor(TEAL)
        canvas.setFont("Helvetica-Bold", 8)
        canvas.drawString(17 * mm, PAGE_H - 10.5 * mm, "FinGPT - Personal Expense Tracker")
    canvas.setFillColor(MUTED)
    canvas.setFont("Helvetica", 8)
    canvas.drawString(17 * mm, 9 * mm, "Panel-ready speaking script")
    canvas.drawRightString(PAGE_W - 17 * mm, 9 * mm, f"Page {doc.page}")
    canvas.restoreState()


styles = getSampleStyleSheet()
title = ParagraphStyle("Title", parent=styles["Title"], fontName="Helvetica-Bold", fontSize=24,
                       leading=28, textColor=NAVY, alignment=TA_CENTER, spaceAfter=4 * mm)
subtitle = ParagraphStyle("Subtitle", parent=styles["Normal"], fontName="Helvetica", fontSize=11,
                          leading=15, textColor=TEAL, alignment=TA_CENTER, spaceAfter=7 * mm)
heading = ParagraphStyle("Heading", parent=styles["Heading2"], fontName="Helvetica-Bold", fontSize=14,
                         leading=17, textColor=TEAL, spaceBefore=3 * mm, spaceAfter=2 * mm)
body = ParagraphStyle("Body", parent=styles["BodyText"], fontName="Helvetica", fontSize=10.2,
                      leading=15.3, textColor=INK, spaceAfter=2.8 * mm)
cue = ParagraphStyle("Cue", parent=body, fontName="Helvetica-Bold", fontSize=8.5, leading=11,
                     textColor=colors.white, backColor=TEAL, borderPadding=(4, 6, 4, 6), spaceAfter=3 * mm)
note = ParagraphStyle("Note", parent=body, fontSize=9, leading=13, textColor=MUTED,
                      backColor=MINT, borderPadding=(5, 7, 5, 7), spaceAfter=3 * mm)


def p(text):
    story.append(Paragraph(text, body))


def h(text, timing=None):
    story.append(Paragraph(text, heading))
    if timing:
        story.append(Paragraph(f"Suggested time: {timing}", cue))


def page():
    story.append(PageBreak())
    story.append(Spacer(1, 3 * mm))


story = [Spacer(1, 9 * mm), Paragraph("FinGPT", title),
         Paragraph("Personal Expense Tracker with Google Gemini AI", subtitle),
         Paragraph("This script uses easy words and is designed for about 15 minutes. Read it naturally and pause while showing each page of the application.", note)]

h("1. Opening and Project Introduction", "1 minute")
p("Good morning or afternoon everyone. My project is called <b>FinGPT</b>. It is a web-based personal expense tracker. Its purpose is to help people record their income and expenses, understand where their money goes, create monthly budgets, and get useful financial guidance with the help of Google Gemini AI.")
p("Many expense trackers only save numbers. FinGPT goes one step further. It changes those numbers into charts, warnings, predictions, and simple suggestions. This makes financial information easier to understand, even for a person who does not have accounting knowledge.")

h("2. Problems This Project Solves", "2 minutes")
p("The first problem is <b>poor expense awareness</b>. People make many small payments every day and often forget them. At the end of the month, they know that money is gone, but they do not know exactly where it was spent. FinGPT keeps all transactions in one place and groups them by month and category.")
p("The second problem is <b>manual calculation</b>. When people use notebooks or simple spreadsheets, they must calculate total income, total expense, and savings themselves. This can take time and may cause mistakes. FinGPT calculates these values automatically whenever the data changes.")
p("The third problem is <b>lack of budget control</b>. A person may decide to spend only a certain amount on food or shopping, but there is no warning when the limit is close. FinGPT compares the category budget with actual spending and clearly shows whether the user is safe, near the limit, or over budget.")
p("The fourth problem is <b>difficult financial analysis</b>. Tables full of numbers can be hard to understand. FinGPT uses graphs, AI insights, and a budgeting assistant to explain the data in easy language. It can point out high spending, healthy savings, possible duplicate payments, and useful next steps.")
p("The fifth problem is <b>generic advice</b>. General financial advice may not match every user. The FinGPT assistant uses the user's saved income and expense data, so its answer is connected to the user's real situation. It does not need to invent financial numbers.")

page()
h("3. Proposed Solution", "1 minute")
p("My solution is a single application where the complete money-management flow is connected. The user creates an account, records transactions, checks totals and charts, sets budgets, generates reports, and uses AI tools. All important financial details are available from one dashboard instead of being spread across notebooks, bills, and separate applications.")
p("The application is designed around monthly data. Each month has income rows, expense rows, categories, and calculated totals. This structure makes it easy to compare one month with another and understand changes over time.")

h("4. Technology Stack", "1 minute")
tech = [
    ["Part", "Technology", "Why it is used"],
    ["Frontend", "React with Vite", "Builds fast and reusable user-interface components"],
    ["Backend", "Node.js and Express", "Receives requests and runs application logic"],
    ["Database", "MongoDB with Mongoose", "Stores users, transactions, totals, and budgets"],
    ["AI", "Google Gemini API", "Creates insights and understands language and receipt images"],
    ["Security", "JWT and bcrypt", "Supports login sessions and protected passwords"],
    ["Visuals", "Recharts", "Displays trends and category-wise spending"],
    ["Reports", "React PDF and PDFKit", "Creates downloadable financial reports"],
]
t = Table(tech, colWidths=[25 * mm, 40 * mm, 89 * mm], repeatRows=1)
t.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), NAVY), ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"), ("FONTNAME", (0, 1), (0, -1), "Helvetica-Bold"),
    ("FONTSIZE", (0, 0), (-1, -1), 8), ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, MINT]),
    ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#C5DAD5")), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("LEFTPADDING", (0, 0), (-1, -1), 5), ("RIGHTPADDING", (0, 0), (-1, -1), 5),
    ("TOPPADDING", (0, 0), (-1, -1), 5), ("BOTTOMPADDING", (0, 0), (-1, -1), 5),
]))
story += [t, Spacer(1, 3 * mm)]

h("5. Registration, Login, and Navigation", "1 minute")
p("A new user first opens the Registration page and enters a name, username, email, and password. The backend validates the information and stores the user in MongoDB. The password is hashed with bcrypt, which means the original password is not stored as plain readable text.")
p("During login, the backend checks the username and password. After successful login, it returns a JWT token. The frontend uses this token to recognize the logged-in session. A Protected Route component prevents a user without a token from directly opening the main pages. The Header provides links to the important sections and also supports logout.")
p("These frontend components are present in <b>client/client/src/components/Registration</b>, <b>Login</b>, <b>ProtectedRoute</b>, and <b>Header</b>. The backend authentication files are in <b>server/server/src/routes/auth.routes.js</b> and <b>controllers/auth.controller.js</b>.")

page()
h("6. Adding and Tracking Transactions", "2 minutes")
p("After login, the user can open the Add Income or Expense page. The user selects whether the transaction is income or expense and enters the date, name, amount, category, month, and year. Common categories are provided, and an Other option allows a custom category.")
p("When the form is submitted, React sends the data to the Express backend through the expenses API. The backend either creates the selected month or updates an existing month. MongoDB stores the rows inside income and expense tables. It also stores total income, total expense, and current amount. The current amount represents savings and is calculated as total income minus total expense.")
p("The Track page displays all saved months. A user can open a month, check its totals, edit a row, delete a row, or remove unwanted data. The page also has a monthly trend chart and a category pie chart. The trend chart compares income, expenses, and savings between months. The pie chart shows which categories use the largest share of money.")
p("The Add component is located at <b>client/client/src/components/AddIncomeAndExpense/index.js</b>. The Track and chart components are in <b>components/Track</b> and <b>components/Charts</b>. The backend files are <b>routes/expense.routes.js</b>, <b>controllers/expense.controller.js</b>, and <b>models/expense.model.js</b>.")

h("7. Budget Management", "1 minute")
p("On the Budgets page, the user chooses a month, year, category, and spending limit. For example, the user can set Rs. 5,000 for groceries. The backend checks how much was actually spent in that category and returns the budget status. A progress bar makes the result easy to see. Normal spending is shown as safe, spending near the limit is shown as a warning, and spending above the limit is shown as over budget.")
p("The Budget Manager is present at <b>client/client/src/components/BudgetManager/index.js</b>. Its backend files are <b>server/server/src/routes/budgets.js</b>, <b>controllers/budget.controller.js</b>, <b>services/budget.service.js</b>, and <b>models/budget.model.js</b>.")

h("8. Reports", "30 seconds")
p("The application can also create a PDF report. This gives the user a portable copy of financial details that can be saved, printed, or shared. The frontend report component is in <b>components/MyDocument</b>. The backend report route, controller, and PDF utility are in <b>routes/report.routes.js</b>, <b>controllers/report.controller.js</b>, and <b>utils/pdfReport.js</b>.")

page()
h("9. Gemini AI Integration", "2 minutes")
p("Google Gemini is connected only through the backend. This is important because the Gemini API key must stay private. The React frontend asks the Express server for an AI result. The server collects only the required financial data from MongoDB, prepares a prompt, calls Gemini, and returns the final result to React.")
p("The first AI feature is <b>automatic categorization</b>. Gemini reads transaction names and selects a suitable category such as Transport, Groceries, Salary, or Utilities. The second feature is <b>monthly insights</b>. Gemini studies the selected month's real totals and creates a short summary with good, neutral, or warning insight cards.")
p("The third feature is the <b>Budgeting Assistant</b>. Users can ask questions such as, 'Where am I spending the most?' or 'How can I improve my savings?' The backend includes the user's financial snapshot in the prompt, so the assistant can give specific advice based on stored data.")
p("The fourth feature is <b>receipt reading</b>. The user can provide a receipt image. Gemini's image understanding extracts details such as the merchant, date, total, category, and items. The result is returned as structured data instead of unorganized text.")
p("The AI interface components are in <b>client/client/src/components/AiInsights</b>, <b>BudgetAssistant</b>, and <b>AiLab</b>. The main Gemini code is in <b>server/server/src/services/ai.service.js</b>. AI routes and controllers are in <b>routes/ai.js</b> and <b>controllers/ai.controller.js</b>.")

h("10. AI Lab and Smart Financial Tools", "1 minute")
p("The AI Lab combines AI-based tools and calculation-based tools. Expense Forecast estimates future income, expense, and savings from recent months. Anomaly Detection looks for unusually high amounts and possible duplicate entries. Smart Budget suggests limits based on past spending. Subscription Detection finds payments that repeat across months.")
p("Goal Planning calculates the amount a user must save each month for a target. What-if Simulation shows how savings may change if income increases or expenses decrease. Smart Search lets the user find transactions using normal sentences. These tools are mainly implemented in <b>server/server/src/services/ai.tools.service.js</b>.")

page()
h("11. System Architecture and Data Flow", "1 minute")
p("The application follows a simple frontend-backend-database structure. First, the user performs an action in a React component. Second, the frontend uses <b>client/client/src/utils/api.js</b> to send an HTTP request. Third, an Express route receives that request. Fourth, a controller checks the input and calls the required service. Fifth, the service reads or updates MongoDB through a Mongoose model. Finally, the backend sends a JSON response, and React updates the screen.")
p("For AI features, there is one extra step. The backend prepares selected financial data and sends it to Gemini. Gemini returns text or structured JSON, the backend checks the result, and the frontend displays it. Keeping Gemini behind the backend protects the key and gives the application better control over the prompt and response.")

h("12. Main Component Locations", "1 minute")
locations = [
    ["Component or layer", "Actual location"],
    ["All frontend routes", "client/client/src/App.js"],
    ["Home page", "client/client/src/components/Home/index.js"],
    ["Login and registration", "client/client/src/components/Login and Registration"],
    ["Add transaction", "client/client/src/components/AddIncomeAndExpense"],
    ["Tracking and charts", "client/client/src/components/Track and Charts"],
    ["Budget manager", "client/client/src/components/BudgetManager"],
    ["AI assistant and lab", "client/client/src/components/BudgetAssistant and AiLab"],
    ["API URL helper", "client/client/src/utils/api.js"],
    ["Backend entry and app", "server/server/server.js and src/app.js"],
    ["Routes and controllers", "server/server/src/routes and src/controllers"],
    ["Database connection", "server/server/src/db/connect.js"],
    ["Database models", "server/server/src/models"],
    ["Gemini and AI tools", "server/server/src/services/ai.service.js and ai.tools.service.js"],
]
lt = Table(locations, colWidths=[50 * mm, 104 * mm], repeatRows=1)
lt.setStyle(TableStyle([
    ("BACKGROUND", (0, 0), (-1, 0), NAVY), ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
    ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"), ("FONTNAME", (0, 1), (0, -1), "Helvetica-Bold"),
    ("FONTSIZE", (0, 0), (-1, -1), 8), ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, MINT]),
    ("GRID", (0, 0), (-1, -1), 0.35, colors.HexColor("#C5DAD5")), ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
    ("LEFTPADDING", (0, 0), (-1, -1), 5), ("RIGHTPADDING", (0, 0), (-1, -1), 5),
    ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
]))
story += [lt]

page()
h("13. Steps to Add the Google Gemini API Key", "1 minute")
p("First, open Google AI Studio and sign in with a Google account. Open the API Keys section, create a new API key, and copy it. If required, select or create a Google Cloud project.")
p("Next, open the <b>server/server</b> folder. Copy <b>.env.example</b> and rename the copy to <b>.env</b>. Inside this file, set <b>GEMINI_API_KEY=your_real_key</b>. Keep <b>GEMINI_MODEL=gemini-2.5-flash</b>. Also provide the MongoDB connection and a strong JWT secret. Finally, restart the backend using <b>npm start</b>.")
p("The key must never be added to the React client, written directly inside source code, or uploaded to GitHub. During deployment on Render, the same values should be added through the service's Environment settings instead of uploading the local .env file.")

h("14. Demonstration Flow", "1 minute")
p("During the demonstration, I will first register or log in. Then I will add one income transaction and two expense transactions. After that, I will open the Track page to show automatic totals and charts. Next, I will set a category budget and show how the progress changes. Finally, I will generate AI insights, ask the Budgeting Assistant one question, and show one AI Lab tool. This order demonstrates the complete flow from data entry to decision support.")

h("15. Advantages, Limits, and Future Scope", "1 minute")
p("The main advantages are simple monthly tracking, automatic calculations, clear charts, category budgets, downloadable reports, and AI guidance based on saved data. The project is useful for students, working people, and families who want a clearer view of everyday money.")
p("The current project also has limits. AI suggestions depend on the quality of entered data and should not replace professional financial advice. Receipt images may be unclear, and Gemini usage depends on internet access, API quota, and service availability. Security can be improved further by applying authentication middleware to every private backend route and by using secure HTTP-only cookies.")
p("In the future, the project can add bank-statement import, recurring transaction reminders, shared family accounts, email alerts, more detailed tax reports, stronger role-based security, and a mobile application.")

h("16. Conclusion", "30 seconds")
p("To conclude, FinGPT solves the problem of unorganized personal spending by placing transactions, totals, budgets, charts, reports, and AI assistance in one application. It does not only store financial data; it helps the user understand that data and take useful action. By combining React, Express, MongoDB, and Google Gemini, the project provides a practical and intelligent approach to personal money management. Thank you.")

story.append(Paragraph("Presentation tip: Speak slowly, pause after each section, and show the related application page while explaining it. This will naturally fill about 15 minutes.", note))

doc = BaseDocTemplate(str(OUT), pagesize=A4, rightMargin=17 * mm, leftMargin=17 * mm,
                      topMargin=19 * mm, bottomMargin=17 * mm, title="FinGPT 15-Minute Panel Explanation",
                      author="FinGPT Project")
frame = Frame(doc.leftMargin, doc.bottomMargin, doc.width, doc.height, id="main")
doc.addPageTemplates([PageTemplate(id="panel", frames=[frame], onPage=decorate)])
doc.build(story)
print(OUT)
