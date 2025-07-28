"use client"

import { useState, useMemo } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import {
  ChevronDown,
  ChevronRight,
  ChevronLeft,
  Search,
  Users,
  LayoutDashboard,
  FileText,
  Briefcase,
  Filter,
  Target,
  UserCheck,
  BookOpen,
  Eye,
  X,
  RefreshCw,
  Zap,
  Trophy,
  CheckCircle,
  Loader,
  PauseCircle,
  TrendingUp,
  TrendingDown,
  Edit,
  Plus,
  Trash2,
  GripVertical,
  Menu,
  Bell,
  Globe,
  User,
  Settings,
  LogOut,
  Mail,
} from "lucide-react"

// Mock authentication context for preview
const useAuth = () => {
  const [user, setUser] = useState({
    id: "1",
    name: "Teguh B. Ariwibowo",
    email: "teguh@foom.com",
    title: "CEO",
    team: "Leadership",
    avatar: "/placeholder.svg?height=40&width=40&text=TA",
  })

  return {
    user,
    login: async () => true,
    logout: () => setUser(null),
    isLoading: false,
  }
}

// Mock Google Sheets data for preview
const mockTeamData = {
  "Brand & Creative": {
    projects: [
      {
        id: "1",
        task: "Website Redesign Project",
        priority: "P0",
        owner: "Umi Nur Fadila",
        status: "In progress",
        startDate: "2025-01-01",
        endDate: "2025-02-15",
        progress: "65%",
        milestone: "Design Phase Complete",
        notes: "On track with current timeline",
      },
      {
        id: "2",
        task: "Brand Guidelines Update",
        priority: "P1",
        owner: "Christian Evander",
        status: "Completed",
        startDate: "2024-12-01",
        endDate: "2025-01-10",
        progress: "100%",
        milestone: "Final Review",
        notes: "Successfully completed",
      },
    ],
    performance: [
      {
        id: "1",
        kpi: "Brand Awareness Score",
        responsible: "Feranti Susilowati",
        accountable: "A",
        consult: "B",
        inform: "C",
        shared: "Yes",
        sharedWith: "Marketing Team",
        status: "Progress",
        todayProgress: 75,
        expectedTarget: 80,
      },
      {
        id: "2",
        kpi: "Creative Asset Production",
        responsible: "Christian Evander",
        accountable: "A",
        consult: "B",
        inform: "C",
        shared: "No",
        sharedWith: "N/A",
        status: "Open",
        todayProgress: 45,
        expectedTarget: 50,
      },
    ],
    punctuality: [
      {
        date: "2025-01-20",
        "feranti susilowati": "On Time",
        "christian evander": "On Time",
        "umi nur fadila": "Late",
      },
      {
        date: "2025-01-21",
        "feranti susilowati": "On Time",
        "christian evander": "On Time",
        "umi nur fadila": "On Time",
      },
    ],
    lastUpdated: new Date(),
    isLoading: false,
    error: null,
  },
  "Digital Marketing": {
    projects: [
      {
        id: "3",
        task: "Social Media Campaign Q1",
        priority: "P1",
        owner: "Andree Indrawan",
        status: "Planning",
        startDate: "2025-02-01",
        endDate: "2025-03-31",
        progress: "25%",
        milestone: "Strategy Development",
        notes: "Initial planning phase",
      },
    ],
    performance: [
      {
        id: "3",
        kpi: "Social Media Engagement",
        responsible: "Andree Indrawan",
        accountable: "A",
        consult: "B",
        inform: "C",
        shared: "Yes",
        sharedWith: "Brand Team",
        status: "Progress",
        todayProgress: 85,
        expectedTarget: 90,
      },
    ],
    punctuality: [
      {
        date: "2025-01-20",
        "andree indrawan": "On Time",
        "sabdo teguh": "On Time",
      },
    ],
    lastUpdated: new Date(),
    isLoading: false,
    error: null,
  },
}

// Mock hooks for preview
const useGoogleSheets = () => ({
  teamData: mockTeamData,
  refreshTeamData: async () => {},
  refreshAllData: async () => {},
  updateProject: async () => {},
  addProject: async () => {},
  deleteProject: async () => {},
  updatePerformance: async () => {},
  addPerformance: async () => {},
  updatePunctuality: async () => {},
  isInitialized: true,
  globalError: null,
})

const useDragAndDrop = () => {
  const [draggedItem, setDraggedItem] = useState(null)
  const [dropZone, setDropZone] = useState(null)

  return {
    draggedItem,
    dropZone,
    handleDragStart: (type, data) => setDraggedItem({ type, data }),
    handleDragEnd: () => {
      setDraggedItem(null)
      setDropZone(null)
    },
    handleDragOver: (e) => e.preventDefault(),
    handleDragEnter: (zoneId) => setDropZone(zoneId),
    handleDragLeave: () => setDropZone(null),
    handleDrop: (e, zoneId, onDrop) => {
      e.preventDefault()
      if (draggedItem) {
        onDrop(draggedItem.data, zoneId)
      }
      setDraggedItem(null)
      setDropZone(null)
    },
  }
}

// --- EXISTING MOCK DATA (For Leadership & People) ---
const mockData = {
  kpis: {
    channelMix: { direct: 3, indirect: 97, goalDirect: 30, goalIndirect: 70 },
    directChannelGrowth: 27.7,
    newStoreExpansion: { current: 3, target: 99 },
    activeInitiatives: 48,
  },
  channelPerformance: [
    { name: "Jan", direct: 1.2, indirect: 40 },
    { name: "Feb", direct: 1.5, indirect: 45 },
    { name: "Mar", direct: 1.8, indirect: 52 },
    { name: "Apr", direct: 2.1, indirect: 58 },
    { name: "May", direct: 2.5, indirect: 65 },
    { name: "Jun", direct: 3.0, indirect: 72 },
  ],
  keyInitiatives: [
    { id: 1, title: "Website Revamp", owner: "Umi Nur Fadila", status: "On Track" },
    { id: 2, title: "Store Connect - Payment", owner: "Rakhasatya Mahardhika Pangestu", status: "At Risk" },
    { id: 3, title: "Odoo - Sales", owner: "IT Internship", status: "On Track" },
    { id: 4, title: "ASE Alignment", owner: "Teguh Sukmanaputra", status: "Delayed" },
    { id: 5, title: "Store Incentive - Disbursement", owner: "Teguh Sukmanaputra", status: "On Track" },
  ],
  salesByRegion: [
    { id: "ID-JK", name: "Jakarta", performance: "exceeding" },
    { id: "ID-JB", name: "West Java", performance: "on_target" },
    { id: "ID-JT", name: "Central Java", performance: "underperforming" },
    { id: "ID-JI", name: "East Java", performance: "exceeding" },
    { id: "ID-BT", name: "Banten", performance: "on_target" },
    { id: "ID-YO", name: "Yogyakarta", performance: "underperforming" },
  ],
  skuPerformance: {
    top5: [
      { sku: "FOOM-LIQ-001", name: "Iced Black", sales: 1200 },
      { sku: "FOOM-POD-X", name: "Pod X", sales: 1150 },
      { sku: "FOOM-LIQ-003", name: "Mango Blast", sales: 980 },
      { sku: "FOOM-ACC-002", name: "Lanyard", sales: 850 },
      { sku: "FOOM-LIQ-010", name: "Tiramisu", sales: 820 },
    ],
    bottom5: [
      { sku: "FOOM-LIQ-015", name: "Grapefruit", sales: 50 },
      { sku: "FOOM-POD-C", name: "Pod C", sales: 75 },
      { sku: "FOOM-LIQ-008", name: "Lychee", sales: 90 },
      { sku: "FOOM-ACC-005", name: "Sticker Pack", sales: 110 },
      { sku: "FOOM-LIQ-012", name: "Guava", sales: 130 },
    ],
  },
  projects: [
    {
      id: 1,
      title: "[OS] - Checking, Migrate & change trx id & inventories Product Data",
      owner: "Rakhasatya Mahardhika Pangestu",
      dueDate: "2025-06-04",
      priority: "Urgent",
      teams: ["Growth & Tech"],
      status: "Completed",
    },
    {
      id: 2,
      title: "[DELIV] - Enhance EDC connection to Store Connect",
      owner: "Rakhasatya Mahardhika Pangestu",
      dueDate: "2025-06-05",
      priority: "High",
      teams: ["Growth & Tech", "Retail"],
      status: "Blocked/At Risk",
    },
    {
      id: 3,
      title: "[DEVDL] - Create API GET Sales Order - Ghiyats",
      owner: "IT Internship",
      dueDate: "2025-06-04",
      priority: "High",
      teams: ["Growth & Tech"],
      status: "Completed",
    },
    {
      id: 4,
      title: "[DEVDL] - Create API GET Sales Order Line - Ghiyats",
      owner: "IT Internship",
      dueDate: "2025-06-05",
      priority: "Medium",
      teams: ["Growth & Tech"],
      status: "Completed",
    },
    {
      id: 5,
      title: "[OS] - Operational Support - Refund order",
      owner: "Rakhasatya Mahardhika Pangestu",
      dueDate: "2025-06-05",
      priority: "Low",
      teams: ["Growth & Tech", "HR"],
      status: "In Progress",
    },
    {
      id: 6,
      title: "[EXPL] - Daily Alignment with Area Sales Team",
      owner: "Teguh Sukmanaputra",
      dueDate: "2025-07-01",
      priority: "High",
      teams: ["Sales & Marketing"],
      status: "Completed",
    },
    {
      id: 7,
      title: "[RQRY] - ASE Visit Journey Plan in July W1",
      owner: "Teguh Sukmanaputra",
      dueDate: "2025-07-01",
      priority: "Medium",
      teams: ["Sales & Marketing"],
      status: "Planning",
    },
    {
      id: 8,
      title: "New Employee Onboarding Process",
      owner: "Indah Dwi Purnama",
      dueDate: "2025-08-15",
      priority: "High",
      teams: ["HR"],
      status: "Planning",
    },
    {
      id: 9,
      title: "Q3 Marketing Campaign",
      owner: "Feranti Susilowati",
      dueDate: "2025-09-01",
      priority: "Urgent",
      teams: ["Sales & Marketing", "Brand Creative"],
      status: "Project Charter",
    },
    {
      id: 10,
      title: "New Product Launch: FOOM Pod Z",
      owner: "Jiem Ilham",
      dueDate: "2025-10-01",
      priority: "Urgent",
      teams: ["Product", "RnD", "Sales & Marketing"],
      status: "Project Charter",
    },
  ],
  people: [
    {
      id: 1,
      name: "Teguh B. Ariwibowo",
      title: "CEO",
      team: "C-Suite",
      managerId: null,
      avatar: "/placeholder.svg?height=100&width=100&text=TA",
    },
    {
      id: 2,
      name: "Feranti Susilowati",
      title: "CMO",
      team: "C-Suite",
      managerId: 1,
      avatar: "/placeholder.svg?height=100&width=100&text=FS",
    },
    {
      id: 3,
      name: "Johan Santoso",
      title: "VP Supply Chain",
      team: "VP",
      managerId: 1,
      avatar: "/placeholder.svg?height=100&width=100&text=JS",
    },
    {
      id: 4,
      name: "Frans Yohanes",
      title: "VP Finance Acc. Tax",
      team: "VP",
      managerId: 1,
      avatar: "/placeholder.svg?height=100&width=100&text=FY",
    },
    {
      id: 5,
      name: "M Rifki Abdul Aziz",
      title: "Head of Human Capital",
      team: "Head",
      managerId: 1,
      avatar: "/placeholder.svg?height=100&width=100&text=RA",
    },
    {
      id: 6,
      name: "Umi Nur Fadila",
      title: "Head of Growth & Tech",
      team: "Head",
      managerId: 1,
      avatar: "/placeholder.svg?height=100&width=100&text=UF",
    },
    {
      id: 7,
      name: "Jiem Ilham",
      title: "Head of Product Development",
      team: "Head",
      managerId: 2,
      avatar: "/placeholder.svg?height=100&width=100&text=JI",
    },
    {
      id: 8,
      name: "Agus Sondara Z.",
      title: "Sr. Mgr Retail",
      team: "Sr. Mgr",
      managerId: 2,
      avatar: "/placeholder.svg?height=100&width=100&text=AS",
    },
    {
      id: 9,
      name: "Andree Indrawan",
      title: "Manager Trade Marketing",
      team: "Manager",
      managerId: 2,
      avatar: "/placeholder.svg?height=100&width=100&text=AI",
    },
    {
      id: 10,
      name: "Christian Evander",
      title: "Manager Digital Marketing",
      team: "Manager",
      managerId: 2,
      avatar: "/placeholder.svg?height=100&width=100&text=CE",
    },
    {
      id: 11,
      name: "Sabdo Teguh P.",
      title: "Manager Sales",
      team: "Manager",
      managerId: 2,
      avatar: "/placeholder.svg?height=100&width=100&text=ST",
    },
    {
      id: 12,
      name: "Indah Dwi Purnama",
      title: "HC Business Partner",
      team: "Manager",
      managerId: 5,
      avatar: "/placeholder.svg?height=100&width=100&text=IP",
    },
    {
      id: 13,
      name: "Rakhasatya Mahardhika Pangestu",
      title: "Business System Analyst",
      team: "Growth & Tech",
      managerId: 6,
      avatar: "/placeholder.svg?height=100&width=100&text=RP",
    },
    {
      id: 14,
      name: "Teguh Sukmanaputra",
      title: "Data Analyst",
      team: "Growth & Tech",
      managerId: 6,
      avatar: "/placeholder.svg?height=100&width=100&text=TS",
    },
    {
      id: 15,
      name: "IT Internship",
      title: "Intern",
      team: "Growth & Tech",
      managerId: 6,
      avatar: "/placeholder.svg?height=100&width=100&text=IT",
    },
  ],
  teams: ["Sales & Marketing", "Growth & Tech", "HR", "Product", "Retail", "Brand Creative", "RnD", "Ops"],
}

const projectStatusConfig = {
  "Project Charter": { color: "bg-gray-500", order: 1 },
  Planning: { color: "bg-blue-500", order: 2 },
  "In Progress": { color: "bg-yellow-500", order: 3 },
  "Blocked/At Risk": { color: "bg-red-500", order: 4 },
  Completed: { color: "bg-green-500", order: 5 },
}

const priorityConfig = {
  Urgent: { color: "bg-red-600", level: 4 },
  High: { color: "bg-orange-500", level: 3 },
  Medium: { color: "bg-yellow-400", level: 2 },
  Low: { color: "bg-green-500", level: 1 },
}

const statusColors = {
  "On Track": "bg-green-100 text-green-800",
  "At Risk": "bg-yellow-100 text-yellow-800",
  Delayed: "bg-red-100 text-red-800",
}

const detailTableConfigs = {
  projects: {
    task: "Task",
    priority: "P",
    owner: "Owner",
    status: "Status",
    startDate: "Start Date",
    endDate: "End Date",
    progress: "Progress",
    milestone: "Milestone",
    notes: "Notes",
  },
  kpi: {
    kpi: "KPI / OKR",
    responsible: "Responsible",
    accountable: "Accountable",
    consult: "Consult",
    inform: "Inform",
    shared: "Shared?",
    sharedWith: "Shared With",
    status: "Status",
  },
}

// User Profile Component
function UserProfile() {
  const { user, logout } = useAuth()
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)

  if (!user) return null

  return (
    <>
      <div className="relative">
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          <img
            src={user.avatar || "/placeholder.svg"}
            alt={user.name}
            className="w-8 h-8 rounded-full border-2 border-purple-500"
          />
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-white">{user.name}</p>
            <p className="text-xs text-gray-400">{user.title}</p>
          </div>
          <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isDropdownOpen ? "rotate-180" : ""}`} />
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-xl border border-gray-700 z-50">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center space-x-3">
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name}
                  className="w-12 h-12 rounded-full border-2 border-purple-500"
                />
                <div>
                  <p className="font-medium text-white">{user.name}</p>
                  <p className="text-sm text-gray-400">{user.title}</p>
                  <p className="text-xs text-purple-400">{user.team}</p>
                </div>
              </div>
            </div>

            <div className="p-2">
              <button
                onClick={() => {
                  setIsSettingsOpen(true)
                  setIsDropdownOpen(false)
                }}
                className="w-full flex items-center space-x-3 p-2 text-left hover:bg-gray-700 rounded-lg transition-colors"
              >
                <Settings className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-white">Profile Settings</span>
              </button>

              <button
                onClick={logout}
                className="w-full flex items-center space-x-3 p-2 text-left hover:bg-gray-700 rounded-lg transition-colors text-red-400"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Sign Out</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
            <div className="p-6 border-b border-gray-700 flex justify-between items-center">
              <h2 className="text-xl font-semibold text-white">Profile Settings</h2>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-gray-700 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <img
                  src={user.avatar || "/placeholder.svg"}
                  alt={user.name}
                  className="w-16 h-16 rounded-full border-2 border-purple-500"
                />
                <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm">
                  Change Avatar
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                  <User className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm font-medium text-white">{user.name}</p>
                    <p className="text-xs text-gray-400">Full Name</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                  <Mail className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm font-medium text-white">{user.email}</p>
                    <p className="text-xs text-gray-400">Email Address</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                  <Briefcase className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm font-medium text-white">{user.title}</p>
                    <p className="text-xs text-gray-400">Job Title</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                  <Users className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-sm font-medium text-white">{user.team}</p>
                    <p className="text-xs text-gray-400">Team</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-700 flex justify-end space-x-3">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

// Header Component
function Header({ isSidebarOpen, toggleSidebar, activeTab }) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  const getPageTitle = () => {
    switch (activeTab) {
      case "Leadership":
        return "Leadership Huddle"
      case "Initiatives":
        return "Initiatives & Projects"
      case "TeamHuddles":
        return "Team Huddles"
      case "Knowledge":
        return "Knowledge Base"
      case "People":
        return "People & Organization"
      default:
        return "Dashboard"
    }
  }

  return (
    <header className="bg-gray-800 border-b border-gray-700 px-4 py-3 flex items-center justify-between relative z-40">
      <div className="flex items-center space-x-4">
        <button onClick={toggleSidebar} className="lg:hidden p-2 hover:bg-gray-700 rounded-lg transition-colors">
          {isSidebarOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
        </button>

        <div className="hidden lg:flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">F</span>
            </div>
            <div className="text-purple-400 font-bold text-lg">ONE Pulse</div>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-white">{getPageTitle()}</h1>
            <p className="text-xs text-gray-400">Real-time organizational intelligence</p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {/* Search */}
        <div className="relative">
          <button
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <Search className="w-5 h-5 text-gray-400" />
          </button>

          {isSearchOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
              <div className="p-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search projects, people, or data..."
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
                    autoFocus
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notifications */}
        <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors relative">
          <Bell className="w-5 h-5 text-gray-400" />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
        </button>

        {/* Language/Region */}
        <button className="p-2 hover:bg-gray-700 rounded-lg transition-colors">
          <Globe className="w-5 h-5 text-gray-400" />
        </button>

        {/* User Profile */}
        <UserProfile />
      </div>
    </header>
  )
}

// Mock Google Sheets Status Component
function GoogleSheetsStatus({ isInitialized, globalError, teamData, onRefresh }) {
  const [isRefreshing, setIsRefreshing] = useState(false)

  const handleRefresh = async () => {
    setIsRefreshing(true)
    setTimeout(() => setIsRefreshing(false), 1000)
  }

  return (
    <div className="flex items-center justify-between p-3 rounded-lg border bg-green-900 border-green-500">
      <div className="flex items-center gap-3">
        <CheckCircle className="w-4 h-4 text-green-400" />
        <div>
          <p className="text-sm font-medium text-white">Connected to Google Sheets (Demo Mode)</p>
          <p className="text-xs text-gray-400">Last updated: {new Date().toLocaleTimeString()}</p>
        </div>
      </div>

      <button
        onClick={handleRefresh}
        disabled={isRefreshing}
        className="flex items-center gap-2 px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 rounded text-sm transition-colors"
      >
        <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
        {isRefreshing ? "Syncing..." : "Sync"}
      </button>
    </div>
  )
}

// Main App Component
function App() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("Leadership")
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  // Google Sheets integration (mocked for preview)
  const {
    teamData,
    refreshTeamData,
    refreshAllData,
    updateProject,
    addProject,
    deleteProject,
    updatePerformance,
    addPerformance,
    updatePunctuality,
    isInitialized,
    globalError,
  } = useGoogleSheets()

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans flex flex-col">
      <Header
        isSidebarOpen={isSidebarOpen}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        activeTab={activeTab}
      />

      <div className="flex flex-1 overflow-hidden">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Google Sheets Status Bar */}
            <div className="mb-6">
              <GoogleSheetsStatus
                isInitialized={isInitialized}
                globalError={globalError}
                teamData={teamData}
                onRefresh={refreshAllData}
              />
            </div>

            {activeTab === "Leadership" && <LeadershipDashboard setActiveTab={setActiveTab} />}
            {activeTab === "Initiatives" && <Initiatives />}
            {activeTab === "TeamHuddles" && (
              <TeamHuddlesDashboard
                teamData={teamData}
                onUpdateProject={updateProject}
                onAddProject={addProject}
                onDeleteProject={deleteProject}
                onUpdatePerformance={updatePerformance}
                onAddPerformance={addPerformance}
                onUpdatePunctuality={updatePunctuality}
                onRefreshTeam={refreshTeamData}
              />
            )}
            {activeTab === "Knowledge" && <KnowledgeBase />}
            {activeTab === "People" && <PeopleDirectory />}
          </div>
        </main>
      </div>
    </div>
  )
}

// Enhanced Sidebar Component
const Sidebar = ({ activeTab, setActiveTab, isOpen, onClose }) => {
  const navItems = [
    { id: "Leadership", icon: LayoutDashboard, label: "Leadership Huddle" },
    { id: "Initiatives", icon: Briefcase, label: "Initiatives & Projects" },
    { id: "TeamHuddles", icon: Users, label: "Team Huddles" },
    { id: "Knowledge", icon: BookOpen, label: "Knowledge Base" },
    { id: "People", icon: Users, label: "People & Org" },
  ]

  const [isSidebarOpen, setIsSidebarOpen] = useState(true)

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <nav
        className={`
        fixed lg:relative top-0 left-0 h-full z-50 
        bg-gray-800 border-r border-gray-700 
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        ${isOpen ? "w-64" : "lg:w-16"}
      `}
      >
        <div className="flex flex-col h-full">
          {/* Logo Section */}
          <div className="p-4 border-b border-gray-700">
            <div className={`flex items-center transition-all duration-300 ${isOpen ? "space-x-3" : "justify-center"}`}>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">F</span>
                </div>
                {isOpen && <div className="text-purple-400 font-bold text-lg">ONE Pulse</div>}
              </div>
            </div>
          </div>

          {/* Toggle Button */}
          <div className="hidden lg:flex justify-end p-2 border-b border-gray-700">
            <button
              onClick={() => setIsSidebarOpen(!isOpen)}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              {isOpen ? (
                <ChevronLeft className="w-4 h-4 text-gray-400" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-400" />
              )}
            </button>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => {
                      setActiveTab(item.id)
                      if (window.innerWidth < 1024) onClose()
                    }}
                    className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 group ${
                      activeTab === item.id
                        ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg"
                        : "text-gray-400 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <item.icon className={`${isOpen ? "mr-3" : "mx-auto"} h-5 w-5 transition-colors`} />
                    {isOpen && <span className="font-medium">{item.label}</span>}
                    {!isOpen && (
                      <div className="absolute left-full ml-2 px-2 py-1 bg-gray-700 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                        {item.label}
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Footer */}
          <div className={`p-4 border-t border-gray-700 ${isOpen ? "text-center" : "text-xs"}`}>
            <p className="text-gray-500 text-xs">{isOpen ? "© 2025 FOOM Lab Global" : "© 2025"}</p>
            {isOpen && <p className="text-gray-600 text-xs mt-1">Version 2.0.0 - Preview Mode</p>}
          </div>
        </div>
      </nav>
    </>
  )
}

// Enhanced Initiatives Component with Drag & Drop
const Initiatives = () => {
  const [projects, setProjects] = useState(mockData.projects)
  const [selectedProject, setSelectedProject] = useState(null)
  const [filterTeam, setFilterTeam] = useState("All")
  const [isCrossCollab, setIsCrossCollab] = useState(false)

  const {
    draggedItem,
    dropZone,
    handleDragStart,
    handleDragEnd,
    handleDragOver,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
  } = useDragAndDrop()

  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const teamMatch = filterTeam === "All" || p.teams.includes(filterTeam)
      const crossCollabMatch = !isCrossCollab || p.teams.length > 1
      return teamMatch && crossCollabMatch
    })
  }, [projects, filterTeam, isCrossCollab])

  const columns = Object.keys(projectStatusConfig).sort(
    (a, b) => projectStatusConfig[a].order - projectStatusConfig[b].order,
  )

  const handleMoveProject = (projectId, newStatus) => {
    setProjects((prev) => prev.map((p) => (p.id === projectId ? { ...p, status: newStatus } : p)))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Initiatives & Projects
          </h1>
          <p className="text-gray-400 mt-1">Track all company initiatives from ideation to completion.</p>
        </div>
        <button className="px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl">
          <Plus className="w-4 h-4 mr-2 inline" />
          New Initiative
        </button>
      </div>

      {/* Enhanced Filters */}
      <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 shadow-lg">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <Filter className="text-purple-400" />
            <span className="font-semibold text-white">Filter by:</span>
          </div>
          <div className="relative">
            <select
              value={filterTeam}
              onChange={(e) => setFilterTeam(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded-lg py-2 pl-3 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
            >
              <option value="All">All Teams</option>
              {mockData.teams.map((team) => (
                <option key={team} value={team}>
                  {team}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
          </div>
          <button
            onClick={() => setIsCrossCollab(!isCrossCollab)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
              isCrossCollab
                ? "bg-gradient-to-r from-purple-600 to-purple-700 text-white shadow-lg"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            Cross-Collab Huddle
          </button>
        </div>
      </div>

      {/* Enhanced Kanban Board with Drag & Drop */}
      <div className="flex gap-6 overflow-x-auto pb-4">
        {columns.map((status) => (
          <div
            key={status}
            className={`w-80 flex-shrink-0 bg-gray-800 rounded-xl border border-gray-700 shadow-lg transition-all duration-200 ${
              dropZone === status ? "ring-2 ring-purple-500 bg-gray-750" : ""
            }`}
            onDragOver={handleDragOver}
            onDragEnter={() => handleDragEnter(status)}
            onDragLeave={handleDragLeave}
            onDrop={(e) =>
              handleDrop(e, status, (project, newStatus) => {
                handleMoveProject(project.id, newStatus)
              })
            }
          >
            <div
              className={`font-semibold p-4 flex items-center justify-between text-white border-b-4 rounded-t-xl ${projectStatusConfig[
                status
              ].color.replace("bg", "border")}`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${projectStatusConfig[status].color}`}></div>
                {status}
              </div>
              <span className="text-sm bg-gray-700 text-gray-300 rounded-full px-3 py-1">
                {filteredProjects.filter((p) => p.status === status).length}
              </span>
            </div>
            <div className="p-4 space-y-4 h-[calc(100vh-20rem)] overflow-y-auto">
              {filteredProjects
                .filter((p) => p.status === status)
                .map((project) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    onClick={() => setSelectedProject(project)}
                    onDragStart={handleDragStart}
                    onDragEnd={handleDragEnd}
                    isDragging={draggedItem?.data.id === project.id}
                  />
                ))}
            </div>
          </div>
        ))}
      </div>

      {selectedProject && <ProjectDetailView project={selectedProject} onClose={() => setSelectedProject(null)} />}
    </div>
  )
}

const ProjectCard = ({ project, onClick, onDragStart, onDragEnd, isDragging }) => {
  const { color } = priorityConfig[project.priority] || {}

  return (
    <div
      draggable
      onDragStart={() => onDragStart("project", project)}
      onDragEnd={onDragEnd}
      onClick={onClick}
      className={`bg-gray-700 rounded-lg cursor-move transition-all duration-200 shadow-md hover:shadow-lg hover:bg-gray-600 border border-gray-600 hover:border-purple-500 ${
        isDragging ? "opacity-50 rotate-3 scale-105" : ""
      }`}
    >
      <div className="p-4">
        <div className="flex items-start justify-between mb-3">
          <h4 className="font-bold text-white leading-tight flex-1 mr-2">{project.title}</h4>
          <GripVertical className="w-4 h-4 text-gray-400 flex-shrink-0" />
        </div>

        <div className="flex justify-between items-center text-sm text-gray-400 mb-3">
          <span>Owner: {project.owner}</span>
          <span>Due: {project.dueDate}</span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {project.teams.map((team) => (
              <span key={team} className="text-xs bg-gray-600 text-gray-300 px-2 py-1 rounded-full">
                #{team}
              </span>
            ))}
          </div>
          <span className={`px-3 py-1 text-xs font-bold text-white rounded-full ${color} shadow-sm`}>
            {project.priority}
          </span>
        </div>
      </div>
    </div>
  )
}

const ProjectDetailView = ({ project, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 text-white w-full max-w-4xl max-h-[90vh] rounded-xl shadow-2xl border border-gray-700 flex flex-col">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-white">{project.title}</h2>
            <p className="text-purple-400 mt-1">{project.teams.join(", ")}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-grow">
          {/* Project Charter */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-purple-400">Project Charter</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-700 p-6 rounded-lg">
              <div>
                <strong className="text-gray-400 block">Problem Statement:</strong>
                <span className="text-white">What are we solving?</span>
              </div>
              <div>
                <strong className="text-gray-400 block">Goals & Key Metrics (OKRs):</strong>
                <span className="text-white">Increase online conversion by 15%</span>
              </div>
              <div>
                <strong className="text-gray-400 block">Scope:</strong>
                <span className="text-white">What is in and out of scope?</span>
              </div>
              <div>
                <strong className="text-gray-400 block">Timeline:</strong>
                <span className="text-white">{project.dueDate}</span>
              </div>
            </div>
          </div>

          {/* RACI Matrix */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4 text-purple-400">RACI Matrix</h3>
            <div className="bg-gray-700 p-6 rounded-lg">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="p-2 text-gray-400">Role</th>
                    <th className="p-2 text-gray-400">Name</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 text-gray-300">Responsible</td>
                    <td className="p-2 text-white">{project.owner}</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-gray-300">Accountable</td>
                    <td className="p-2 text-white">Teguh B. Ariwibowo</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-gray-300">Consulted</td>
                    <td className="p-2 text-white">{project.teams.join(", ")}</td>
                  </tr>
                  <tr>
                    <td className="p-2 text-gray-300">Informed</td>
                    <td className="p-2 text-white">All FOOM Leaders</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Sub-tasks & Comments */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-purple-400">Sub-Tasks</h3>
              <div className="bg-gray-700 p-6 rounded-lg space-y-3">
                <label className="flex items-center text-white">
                  <input type="checkbox" className="mr-2 bg-gray-600" defaultChecked />
                  Task 1
                </label>
                <label className="flex items-center text-white">
                  <input type="checkbox" className="mr-2 bg-gray-600" />
                  Task 2
                </label>
                <label className="flex items-center text-white">
                  <input type="checkbox" className="mr-2 bg-gray-600" />
                  Task 3
                </label>
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-purple-400">Updates & Comments</h3>
              <div className="bg-gray-700 p-6 rounded-lg space-y-4 max-h-60 overflow-y-auto">
                <div className="text-sm">
                  <p className="text-white">
                    <strong className="text-purple-400">Umi Nur Fadila:</strong> Kick-off meeting scheduled for next
                    Monday.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">2025-07-24</p>
                </div>
                <div className="text-sm">
                  <p className="text-white">
                    <strong className="text-purple-400">Rakhasatya:</strong> Blocked by third-party API issue. Ticket
                    raised.
                  </p>
                  <p className="text-xs text-gray-500 mt-1">2025-07-25</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Leadership Dashboard Component (Enhanced with better styling)
const LeadershipDashboard = ({ setActiveTab }) => {
  const { kpis, channelPerformance, keyInitiatives, salesByRegion, skuPerformance } = mockData

  const channelMixData = [
    { name: "Direct", value: kpis.channelMix.direct },
    { name: "Indirect", value: kpis.channelMix.indirect },
  ]

  const COLORS = ["#8b5cf6", "#06b6d4"]

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Leadership Huddle
          </h1>
          <p className="text-gray-400 mt-1">Real-time overview of FOOM's strategic progress.</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>Live Data</span>
        </div>
      </div>

      {/* Enhanced KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-gray-400 text-sm font-medium mb-4">Channel Mix (Direct vs Indirect)</h3>
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channelMixData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={50}
                  fill="#8884d8"
                >
                  {channelMixData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="text-center mt-2">
            <p className="text-lg font-semibold text-white">
              {kpis.channelMix.direct}% vs {kpis.channelMix.indirect}%
            </p>
            <p className="text-xs text-gray-500">
              Goal: {kpis.channelMix.goalDirect}% vs {kpis.channelMix.goalIndirect}%
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 shadow-lg flex flex-col justify-between">
          <h3 className="text-gray-400 text-sm font-medium">Direct Channel Growth</h3>
          <p className="text-5xl font-bold text-purple-400">{kpis.directChannelGrowth}x</p>
          <p className="text-gray-500 text-sm">Required growth to hit target</p>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-gray-400 text-sm font-medium mb-4">New Store Expansion</h3>
          <div className="w-full bg-gray-700 rounded-full h-2.5 mb-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${(kpis.newStoreExpansion.current / kpis.newStoreExpansion.target) * 100}%` }}
            ></div>
          </div>
          <p className="text-xl font-semibold text-white">
            {kpis.newStoreExpansion.current} / {kpis.newStoreExpansion.target} Stores
          </p>
          <p className="text-gray-500 text-sm">Annual Target</p>
        </div>

        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 shadow-lg flex flex-col justify-between">
          <h3 className="text-gray-400 text-sm font-medium">Active Initiatives</h3>
          <p className="text-5xl font-bold text-white">{kpis.activeInitiatives}</p>
          <p className="text-gray-500 text-sm">In Progress or Blocked</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Channel Performance */}
        <div className="lg:col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-white">Channel Performance (IDR Billions)</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelPerformance}>
                <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                <XAxis dataKey="name" tick={{ fill: "#A0AEC0" }} />
                <YAxis tick={{ fill: "#A0AEC0" }} />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #374151" }} />
                <Legend wrapperStyle={{ color: "#A0AEC0" }} />
                <Bar dataKey="direct" fill="#8b5cf6" name="Direct" radius={[4, 4, 0, 0]} />
                <Bar dataKey="indirect" fill="#06b6d4" name="Indirect" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Key Strategic Initiatives */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 shadow-lg">
          <h3 className="text-xl font-semibold mb-4 text-white">Key Strategic Initiatives</h3>
          <div className="space-y-4">
            {keyInitiatives.map((initiative) => (
              <div
                key={initiative.id}
                onClick={() => setActiveTab("Initiatives")}
                className="bg-gray-700 p-4 rounded-lg cursor-pointer hover:bg-gray-600 transition-all duration-200 border border-gray-600 hover:border-purple-500"
              >
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-white leading-tight">{initiative.title}</p>
                  <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[initiative.status]}`}>
                    {initiative.status}
                  </span>
                </div>
                <p className="text-sm text-gray-400 mt-1">Owner: {initiative.owner}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Performance & SKU */}
        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 shadow-lg">
            <h3 className="text-xl font-semibold mb-4 text-white">Sales by Region</h3>
            <div className="relative">
              <svg viewBox="0 0 500 200" className="w-full h-auto">
                <g>
                  {/* Simplified Indonesia Map */}
                  <path
                    d="M25,95 l25,-15 l30,5 l20,-10 l40,10 l30,-5 l25,10 l20,-5 l30,15 l-10,20 l-25,5 l-30,-10 l-40,5 l-30,10 l-25,-5 Z"
                    fill="#4A5568"
                    stroke="#8b5cf6"
                    strokeWidth="1"
                  />
                  <path
                    d="M200,80 l30,-20 l40,5 l35,-10 l50,15 l20,10 l-15,25 l-30,-5 l-40,-10 l-55,5 Z"
                    fill="#4A5568"
                    stroke="#8b5cf6"
                    strokeWidth="1"
                  />
                  <path
                    d="M400,100 l40,-10 l30,20 l-10,30 l-40,-5 l-10,-25 Z"
                    fill="#4A5568"
                    stroke="#8b5cf6"
                    strokeWidth="1"
                  />
                </g>
                {/* Mock regions */}
                <circle cx="70" cy="80" r="8" className="fill-green-500" />
                <circle cx="250" cy="70" r="8" className="fill-yellow-500" />
                <circle cx="150" cy="110" r="8" className="fill-red-500" />
              </svg>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-green-500 mr-2"></span>
                <span className="text-gray-300">Exceeding Target</span>
              </div>
              <div className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-yellow-500 mr-2"></span>
                <span className="text-gray-300">On Target</span>
              </div>
              <div className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-red-500 mr-2"></span>
                <span className="text-gray-300">Underperforming</span>
              </div>
            </div>
          </div>
          <div className="md:col-span-2 bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 shadow-lg grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center text-white">
                <TrendingUp className="text-green-400 mr-2" /> Top 5 SKUs
              </h3>
              <div className="space-y-2">
                {skuPerformance.top5.map((sku) => (
                  <div key={sku.sku} className="text-sm p-3 bg-gray-700 rounded-lg border border-gray-600">
                    <p className="font-semibold text-white">{sku.name}</p>
                    <p className="text-gray-400">{sku.sales.toLocaleString()} units/week</p>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 flex items-center text-white">
                <TrendingDown className="text-red-400 mr-2" /> Bottom 5 SKUs
              </h3>
              <div className="space-y-2">
                {skuPerformance.bottom5.map((sku) => (
                  <div key={sku.sku} className="text-sm p-3 bg-gray-700 rounded-lg border border-gray-600">
                    <p className="font-semibold text-white">{sku.name}</p>
                    <p className="text-gray-400">{sku.sales.toLocaleString()} units/week</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Team Huddles Dashboard Component
const TeamHuddlesDashboard = ({
  teamData,
  onUpdateProject,
  onAddProject,
  onDeleteProject,
  onUpdatePerformance,
  onAddPerformance,
  onUpdatePunctuality,
  onRefreshTeam,
}) => {
  const [selectedTeam, setSelectedTeam] = useState("Brand & Creative")
  const [detailedView, setDetailedView] = useState(null)

  const currentTeamData = teamData[selectedTeam]
  const availableTeams = Object.keys(teamData)

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Team Huddle Dashboards
          </h1>
          <p className="text-gray-400 mt-1">Real-time performance tracking (Demo Mode).</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 transition-all duration-200 shadow-lg hover:shadow-xl">
            <RefreshCw size={16} />
            <span>Sync Team</span>
          </button>
        </div>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <div className="relative inline-block">
          <select
            value={selectedTeam}
            onChange={(e) => {
              setSelectedTeam(e.target.value)
              setDetailedView(null)
            }}
            className="bg-gray-700 border border-gray-600 rounded-lg py-2 pl-3 pr-8 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500 text-white"
          >
            {availableTeams.map((team) => (
              <option key={team} value={team}>
                {team}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>

        <div className="text-sm text-gray-400">Last updated: {new Date().toLocaleString()} (Demo)</div>
      </div>

      <BrandCreativeInfographics
        teamData={currentTeamData}
        setDetailedView={setDetailedView}
        onEditProject={() => {}}
        onEditPerformance={() => {}}
        onAddProject={() => {}}
        onAddPerformance={() => {}}
        onDeleteProject={() => {}}
      />

      {detailedView && (
        <DetailedViewModal
          viewType={detailedView}
          teamData={currentTeamData}
          onClose={() => setDetailedView(null)}
          teamName={selectedTeam}
          onEdit={() => {}}
          onDelete={() => {}}
        />
      )}
    </div>
  )
}

// Brand Creative Infographics Component
const BrandCreativeInfographics = ({
  teamData,
  setDetailedView,
  onEditProject,
  onEditPerformance,
  onAddProject,
  onAddPerformance,
  onDeleteProject,
}) => {
  const today = new Date("2025-07-25T00:00:00")

  const projectAnalytics = useMemo(() => {
    const projects = teamData?.projects || []
    const statusCounts = projects.reduce(
      (acc, p) => {
        const status =
          p.status === "In progress" ? "In Progress" : p.status === "Not started" ? "Not Started" : "Completed"
        acc[status] = (acc[status] || 0) + 1
        return acc
      },
      { "In Progress": 0, Completed: 0, "Not Started": 0 },
    )

    const completedThisMonth = projects.filter((p) => {
      const endDate = new Date(p.endDate)
      return (
        p.status === "Completed" &&
        endDate.getMonth() === today.getMonth() &&
        endDate.getFullYear() === today.getFullYear()
      )
    }).length

    const workload = projects.reduce((acc, p) => {
      if (p.status !== "Completed") {
        if (!acc[p.owner]) acc[p.owner] = { P0: 0, P1: 0, D: 0 }
        const priority = p.priority || "D"
        if (acc[p.owner][priority] !== undefined) acc[p.owner][priority]++
      }
      return acc
    }, {})

    const workloadData = Object.keys(workload).map((owner) => ({ owner, ...workload[owner] }))

    return { statusCounts, completedThisMonth, workloadData }
  }, [teamData])

  const kpiAnalytics = useMemo(() => {
    const kpis = teamData?.performance || []
    const pacingData = kpis.map((kpi) => ({
      name: kpi.kpi,
      progress: kpi.todayProgress,
      target: kpi.expectedTarget,
      pacing: kpi.expectedTarget > 0 ? (kpi.todayProgress / kpi.expectedTarget) * 100 : 0,
    }))

    const collaborativeKpis = kpis.filter((k) => k.shared === "Yes")
    const crossFuncCounts = collaborativeKpis.reduce((acc, k) => {
      acc[k.sharedWith] = (acc[k.sharedWith] || 0) + 1
      return acc
    }, {})

    const crossFuncData = Object.keys(crossFuncCounts)
      .map((key) => ({ name: key, value: crossFuncCounts[key] }))
      .sort((a, b) => b.value - a.value)

    return { pacingData, collaborativeKpis, crossFuncData, totalKpis: kpis.length }
  }, [teamData])

  const PRIORITY_COLORS = { P0: "#ef4444", P1: "#f97316", D: "#3b82f6" }

  return (
    <div className="space-y-6">
      {/* Project Health Section */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold flex items-center text-white">
            <Zap className="mr-2 text-blue-400" /> Project Health & Execution
          </h3>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg text-sm transition-all duration-200 shadow-lg">
              <Plus size={14} /> Add Project
            </button>
            <button
              onClick={() => setDetailedView("projects")}
              className="text-sm text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
            >
              <Eye size={14} /> Show Details
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="col-span-1 grid grid-rows-3 gap-4">
            <div className="bg-gray-700 p-4 rounded-lg flex items-center border border-gray-600">
              <Loader className="w-10 h-10 text-yellow-400 mr-4" />
              <div>
                <p className="text-3xl font-bold text-white">{projectAnalytics.statusCounts["In Progress"]}</p>
                <p className="text-gray-400">In Progress</p>
              </div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg flex items-center border border-gray-600">
              <CheckCircle className="w-10 h-10 text-green-400 mr-4" />
              <div>
                <p className="text-3xl font-bold text-white">{projectAnalytics.completedThisMonth}</p>
                <p className="text-gray-400">Completed This Month</p>
              </div>
            </div>
            <div className="bg-gray-700 p-4 rounded-lg flex items-center border border-gray-600">
              <PauseCircle className="w-10 h-10 text-gray-500 mr-4" />
              <div>
                <p className="text-3xl font-bold text-white">{projectAnalytics.statusCounts["Not Started"] || 0}</p>
                <p className="text-gray-400">Not Started</p>
              </div>
            </div>
          </div>
          <div className="lg:col-span-2 bg-gray-700 p-4 rounded-lg border border-gray-600">
            <h4 className="font-semibold mb-2 text-white">Workload & Priority Distribution</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={projectAnalytics.workloadData}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 100, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#4b5563" />
                <XAxis type="number" allowDecimals={false} tick={{ fill: "#9ca3af" }} />
                <YAxis type="category" dataKey="owner" tick={{ fill: "#d1d5db", fontSize: 12 }} width={100} />
                <Tooltip contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #4b5563" }} />
                <Bar dataKey="P0" stackId="a" fill={PRIORITY_COLORS.P0} name="P0 - Urgent" radius={[2, 2, 0, 0]} />
                <Bar dataKey="P1" stackId="a" fill={PRIORITY_COLORS.P1} name="P1 - High" radius={[2, 2, 0, 0]} />
                <Bar dataKey="D" stackId="a" fill={PRIORITY_COLORS.D} name="Daily" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* KPI Performance Section */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold flex items-center text-white">
            <Target className="mr-2 text-green-400" /> KPI & Performance Analytics
          </h3>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg text-sm transition-all duration-200 shadow-lg">
              <Plus size={14} /> Add KPI
            </button>
            <button
              onClick={() => setDetailedView("kpi")}
              className="text-sm text-green-400 hover:text-green-300 flex items-center gap-1 transition-colors"
            >
              <Eye size={14} /> Show Details
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gray-700 p-4 rounded-lg border border-gray-600 grid grid-cols-2 gap-4">
            <h4 className="font-semibold col-span-2 text-white">KPI Pacing</h4>
            {kpiAnalytics.pacingData.map((kpi) => (
              <div key={kpi.name}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-gray-300 truncate">{kpi.name}</span>
                  <span
                    className={`font-bold ${kpi.pacing >= 95 ? "text-green-400" : kpi.pacing >= 75 ? "text-yellow-400" : "text-red-400"}`}
                  >
                    {kpi.pacing.toFixed(0)}% of Target
                  </span>
                </div>
                <div className="w-full bg-gray-600 rounded-full h-4 relative">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(kpi.pacing, 100)}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-gray-700 p-4 rounded-lg border border-gray-600">
            <h4 className="font-semibold text-center mb-2 text-white">Cross-Functional Impact</h4>
            <div className="text-center my-4">
              <p className="text-4xl font-bold text-purple-400">{kpiAnalytics.collaborativeKpis.length}</p>
              <p className="text-gray-400">Collaborative KPIs</p>
              <p className="text-sm text-gray-500">
                ({((kpiAnalytics.collaborativeKpis.length / kpiAnalytics.totalKpis) * 100).toFixed(0)}% of total)
              </p>
            </div>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart
                data={kpiAnalytics.crossFuncData}
                layout="vertical"
                margin={{ top: 5, right: 20, left: 50, bottom: 5 }}
              >
                <XAxis type="number" hide />
                <YAxis type="category" dataKey="name" tick={{ fill: "#d1d5db" }} width={50} />
                <Tooltip
                  contentStyle={{ backgroundColor: "#1f2937", border: "1px solid #4b5563" }}
                  cursor={{ fill: "rgba(255, 255, 255, 0.1)" }}
                />
                <Bar dataKey="value" name="Shared KPIs" fill="#8b5cf6" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Team Habits Section */}
      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold flex items-center text-white">
            <UserCheck className="mr-2 text-yellow-400" /> Team Habits & Culture
          </h3>
          <button
            onClick={() => setDetailedView("punctuality")}
            className="text-sm text-yellow-400 hover:text-yellow-300 flex items-center gap-1 transition-colors"
          >
            <Eye size={14} /> Show Details
          </button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-gray-700 p-4 rounded-lg border border-gray-600">
            <h4 className="font-semibold mb-2 text-white">Team Punctuality Trend (Demo)</h4>
            <div className="h-48 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <Trophy className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                <p>Punctuality data visualization</p>
                <p className="text-sm">(Available in full version)</p>
              </div>
            </div>
          </div>
          <div className="bg-gray-700 p-4 rounded-lg border border-gray-600 flex flex-col items-center justify-center text-center">
            <h4 className="font-semibold mb-2 text-white">Perfect Huddle Streak</h4>
            <Trophy className="w-16 h-16 text-yellow-400 my-4" />
            <p className="text-6xl font-bold text-white">7</p>
            <p className="text-gray-400">Consecutive Days</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Detailed View Modal Component
const DetailedViewModal = ({ viewType, teamData, onClose, teamName, onEdit, onDelete }) => {
  const [filter, setFilter] = useState("")

  const getTitle = () => {
    switch (viewType) {
      case "kpi":
        return "Detailed KPI Performance"
      case "punctuality":
        return "Detailed Huddle Punctuality Log"
      case "projects":
        return "Detailed Project Tracker"
      default:
        return "Details"
    }
  }

  const renderTable = () => {
    let config = {}
    let data = []
    switch (viewType) {
      case "kpi":
        config = detailTableConfigs.kpi
        data = teamData?.performance || []
        break
      case "punctuality":
        if (!teamData?.punctuality || teamData.punctuality.length === 0)
          return <p className="text-gray-400 p-4">No detailed punctuality data available for this team.</p>
        const dynamicConfig = {}
        if (teamData.punctuality.length > 0) {
          Object.keys(teamData.punctuality[0]).forEach((key) => {
            dynamicConfig[key] = key.charAt(0).toUpperCase() + key.slice(1)
          })
        }
        config = dynamicConfig
        data = teamData.punctuality
        break
      case "projects":
        config = detailTableConfigs.projects
        data = teamData?.projects || []
        break
      default:
        return null
    }

    const columnKeys = Object.keys(config)
    const filteredData = data.filter((row) =>
      columnKeys.some((key) => row[key] && String(row[key]).toLowerCase().includes(filter.toLowerCase())),
    )

    return (
      <div className="overflow-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="text-xs text-gray-400 uppercase bg-gray-900 sticky top-0">
            <tr>
              {columnKeys.map((key) => (
                <th key={key} className="p-3 font-semibold">
                  {config[key]}
                </th>
              ))}
              {(viewType === "projects" || viewType === "kpi") && <th className="p-3 font-semibold">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {filteredData.map((row, index) => (
              <tr key={row.id || index} className="hover:bg-gray-700 transition-colors">
                {columnKeys.map((key) => (
                  <td key={key} className="p-3 text-gray-300">
                    {row[key]}
                  </td>
                ))}
                {(viewType === "projects" || viewType === "kpi") && (
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <button className="p-1 text-blue-400 hover:text-blue-300 transition-colors rounded hover:bg-gray-600">
                        <Edit size={16} />
                      </button>
                      {viewType === "projects" && (
                        <button className="p-1 text-red-400 hover:text-red-300 transition-colors rounded hover:bg-gray-600">
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 text-white w-full max-w-7xl h-[90vh] rounded-xl shadow-2xl border border-gray-700 flex flex-col">
        <div className="p-4 border-b border-gray-700 flex justify-between items-center flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-white">{getTitle()}</h2>
            <p className="text-sm text-purple-400">{teamName}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-gray-700 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4 flex-shrink-0">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Filter data..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
            />
          </div>
        </div>
        <div className="flex-grow overflow-y-auto px-4 pb-4">{renderTable()}</div>
      </div>
    </div>
  )
}

// Knowledge Base Component
const KnowledgeBase = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Knowledge Base
        </h1>
        <p className="text-gray-400 mt-1">Centralized documentation, SOPs, and platform definitions.</p>
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 sm:p-8 rounded-xl border border-gray-700 shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-purple-400">One Pulse Data Framework: Terms of Reference</h2>
        <div className="space-y-8">
          <div className="bg-gray-700 p-6 rounded-lg border border-gray-600">
            <h3 className="text-xl font-semibold mb-3 flex items-center text-white">
              <FileText className="mr-3 text-blue-400" /> Project Tracker Files
            </h3>
            <p className="text-gray-300 mb-4">
              <strong>Objective:</strong> These files serve as the granular, daily log of all tasks and initiatives a
              team is working on. They capture the "what," "who," and "when" of the team's workload.
            </p>
            <div className="border-t border-gray-600 pt-4">
              <h4 className="font-semibold mb-2 text-white">Key Data Points:</h4>
              <ul className="list-disc list-inside text-gray-400 space-y-1">
                <li>
                  <span className="font-semibold text-white">Task:</span> The specific action item or project name.
                </li>
                <li>
                  <span className="font-semibold text-white">Owner:</span> The person responsible for the task.
                </li>
                <li>
                  <span className="font-semibold text-white">Status:</span> The current state (e.g., In progress,
                  Completed).
                </li>
                <li>
                  <span className="font-semibold text-white">Progress:</span> A percentage indicating task completion.
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 p-6 rounded-lg border-2 border-purple-500">
            <h3 className="text-xl font-semibold mb-3 flex items-center text-white">
              <RefreshCw className="mr-3 text-purple-400" /> Preview Mode Notice
            </h3>
            <p className="text-gray-300 mb-4">
              <strong>Note:</strong> You are currently viewing the preview version of the FOOM One Pulse platform. This
              version includes mock data and simplified functionality for demonstration purposes.
            </p>
            <div className="border-t border-purple-400/30 pt-4">
              <h4 className="font-semibold mb-2 text-white">Full Version Features:</h4>
              <ul className="list-disc list-inside text-gray-400 space-y-1">
                <li>
                  <span className="font-semibold text-white">Google Sheets Integration:</span> Real-time synchronization
                  with your team's Google Sheets
                </li>
                <li>
                  <span className="font-semibold text-white">Authentication System:</span> Secure login with role-based
                  access
                </li>
                <li>
                  <span className="font-semibold text-white">Live Data Updates:</span> Automatic refresh and real-time
                  collaboration
                </li>
                <li>
                  <span className="font-semibold text-white">Advanced Analytics:</span> Comprehensive reporting and
                  insights
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// People Directory Component
const PeopleDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const people = mockData.people

  const buildTree = (list) => {
    const map = {}
    const roots = []
    list.forEach((node) => {
      map[node.id] = { ...node, children: [] }
    })
    list.forEach((node) => {
      if (node.managerId !== null) {
        if (map[node.managerId]) {
          map[node.managerId].children.push(map[node.id])
        } else {
          roots.push(map[node.id])
        }
      } else {
        roots.push(map[node.id])
      }
    })
    return roots
  }

  const orgTree = buildTree(people)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          People Directory & Org Chart
        </h1>
        <p className="text-gray-400 mt-1">Explore the FOOM team structure.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search for people..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-lg py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-purple-500 text-white placeholder-gray-400"
        />
      </div>

      <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-6 rounded-xl border border-gray-700 shadow-lg overflow-x-auto">
        <div className="min-w-max">
          {orgTree.map((node) => (
            <OrgChartNode key={node.id} node={node} searchTerm={searchTerm} />
          ))}
        </div>
      </div>
    </div>
  )
}

const OrgChartNode = ({ node, searchTerm }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const isMatch =
    node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    node.title.toLowerCase().includes(searchTerm.toLowerCase())

  return (
    <div className="relative pl-12 pt-4">
      <div className="flex items-center">
        {node.children.length > 0 && (
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -left-3 top-11 transform -translate-y-1/2 bg-gray-600 hover:bg-gray-500 rounded-full h-6 w-6 flex items-center justify-center text-white z-10 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
        <div
          className={`p-4 rounded-lg flex items-center gap-4 border-2 transition-all duration-200 ${
            isMatch
              ? "bg-gradient-to-r from-purple-900/50 to-pink-900/50 border-purple-500"
              : "bg-gray-700 border-gray-600 hover:border-gray-500"
          }`}
        >
          <img
            src={node.avatar || "/placeholder.svg"}
            alt={node.name}
            className="w-16 h-16 rounded-full border-2 border-gray-500"
          />
          <div>
            <p className="font-bold text-lg text-white">{node.name}</p>
            <p className="text-purple-400">{node.title}</p>
            <p className="text-gray-400 text-sm">{node.team}</p>
          </div>
        </div>
        {!isCollapsed && node.children.length > 0 && (
          <div className="absolute left-6 top-20 bottom-4 w-px bg-gray-600"></div>
        )}
      </div>
      {!isCollapsed && node.children.length > 0 && (
        <div className="mt-4 space-y-4 relative">
          <div className="absolute -left-6 top-0 bottom-0 w-px bg-gray-600"></div>
          {node.children.map((child) => (
            <div key={child.id} className="relative">
              <div className="absolute -left-6 top-1/2 w-6 h-px bg-gray-600"></div>
              <OrgChartNode node={child} searchTerm={searchTerm} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default App
