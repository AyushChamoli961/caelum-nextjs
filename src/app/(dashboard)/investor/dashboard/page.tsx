"use client";

import { useAuth } from "@/hooks/useAuth";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
} from "@/components/ui";
import Link from "next/link";
import { MdCalculate, MdChat, MdTrendingUp, MdArticle } from "react-icons/md";
import { formatCurrency } from "@/lib/utils";

export default function InvestorDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="p-6 md:p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-color3">
          Welcome, {user?.name?.split(" ")[0] || "Investor"}!
        </h1>
        <p className="text-gray-600 mt-2">
          Your investment dashboard with AI-powered insights and calculators.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statsCards.map((stat, index) => (
          <Card key={index}>
            <CardContent className="py-6">
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.bgColor}`}
                >
                  <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                </div>
                <div>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                  <p className="text-2xl font-bold text-color3">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Investment Tools</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {investmentTools.map((tool, index) => (
                  <Link key={index} href={tool.href}>
                    <div className="p-6 rounded-xl border border-gray-100 hover:border-color1 hover:shadow-md transition-all cursor-pointer">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 bg-color1/10 rounded-xl flex items-center justify-center">
                          <tool.icon className="w-7 h-7 text-color1" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-bold text-color3 mb-1">
                            {tool.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {tool.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Calculations */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Calculations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentCalculations.map((calc, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-color5 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-medium text-color1 uppercase">
                        {calc.type}
                      </span>
                      <span className="text-xs text-gray-500">{calc.date}</span>
                    </div>
                    <p className="font-semibold text-color3">
                      {formatCurrency(calc.value)}
                    </p>
                    <p className="text-sm text-gray-500">{calc.details}</p>
                  </div>
                ))}
              </div>
              <Link href="/investor/calculator">
                <Button variant="outline" className="w-full mt-4">
                  View All Calculations
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* AI Assistant Promo */}
      <Card className="mt-6 bg-gradient-to-r from-color9 to-blue-700 text-white">
        <CardContent className="py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">
                AI Investment Assistant
              </h3>
              <p className="text-gray-200 max-w-xl">
                Get instant answers to your school investment questions. Our AI
                is trained on education sector data and can help you make
                informed decisions.
              </p>
            </div>
            <Link href="/investor/chat">
              <Button className="bg-white text-color9 hover:bg-gray-100 whitespace-nowrap">
                Start Chat
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

const statsCards = [
  {
    label: "Total Calculations",
    value: "24",
    icon: MdCalculate,
    bgColor: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    label: "AI Conversations",
    value: "12",
    icon: MdChat,
    bgColor: "bg-green-100",
    iconColor: "text-green-600",
  },
  {
    label: "Avg. ROI Potential",
    value: "18%",
    icon: MdTrendingUp,
    bgColor: "bg-yellow-100",
    iconColor: "text-yellow-600",
  },
  {
    label: "Reports Generated",
    value: "8",
    icon: MdArticle,
    bgColor: "bg-purple-100",
    iconColor: "text-purple-600",
  },
];

const investmentTools = [
  {
    title: "Feasibility Calculator",
    description:
      "Analyze land size and potential built-up area for school investment.",
    href: "/investor/calculator?tab=feasibility",
    icon: MdCalculate,
  },
  {
    title: "Revenue Calculator",
    description: "Project revenue potential based on student capacity.",
    href: "/investor/calculator?tab=revenue",
    icon: MdTrendingUp,
  },
  {
    title: "AI Investment Chat",
    description: "Get AI-powered insights on school investment opportunities.",
    href: "/investor/chat",
    icon: MdChat,
  },
  {
    title: "Market Reports",
    description: "Access detailed reports on education market trends.",
    href: "/investor/reports",
    icon: MdArticle,
  },
];

const recentCalculations = [
  {
    type: "Feasibility",
    value: 15000000,
    details: "10,000 sqft land - Premium",
    date: "2 days ago",
  },
  {
    type: "Revenue",
    value: 30600000,
    details: "600 students capacity",
    date: "5 days ago",
  },
  {
    type: "Feasibility",
    value: 8000000,
    details: "5,000 sqft land - Mid-Segment",
    date: "1 week ago",
  },
];
