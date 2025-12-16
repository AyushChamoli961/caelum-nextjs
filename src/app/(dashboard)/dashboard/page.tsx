"use client";

import { useAuth } from "@/hooks/useAuth";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";
import Link from "next/link";
import { MdMenuBook, MdChat, MdArticle, MdSchool } from "react-icons/md";

export default function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="p-6 md:p-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-color3">
          Welcome back, {user?.name?.split(" ")[0] || "Teacher"}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here&apos;s an overview of your teaching resources and tools.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {quickActions.map((action, index) => (
          <Link key={index} href={action.href}>
            <Card hoverable className="h-full">
              <CardContent className="flex flex-col items-center text-center py-6">
                <div className="w-14 h-14 bg-color1/10 rounded-full flex items-center justify-center mb-4">
                  <action.icon className="w-7 h-7 text-color1" />
                </div>
                <h3 className="font-bold text-color3 mb-2">{action.title}</h3>
                <p className="text-sm text-gray-500">{action.description}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Recent Activity & Resources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-color5 rounded-full flex items-center justify-center flex-shrink-0">
                    <activity.icon className="w-5 h-5 text-color3" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-color3">{activity.title}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Learning Resources */}
        <Card>
          <CardHeader>
            <CardTitle>Learning Resources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {resources.map((resource, index) => (
                <Link
                  key={index}
                  href={resource.href}
                  className="block p-4 rounded-lg border border-gray-100 hover:border-color1 hover:shadow-sm transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-color1/10 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">{resource.icon}</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-color3">
                        {resource.title}
                      </h4>
                      <p className="text-sm text-gray-500">
                        {resource.description}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

const quickActions = [
  {
    title: "Lesson Planner",
    description: "Create and manage lesson plans",
    href: "/lesson-planner",
    icon: MdMenuBook,
  },
  {
    title: "Ask Monica",
    description: "Get AI teaching assistance",
    href: "/monica-chat",
    icon: MdChat,
  },
  {
    title: "Resources",
    description: "Browse learning materials",
    href: "/resources",
    icon: MdArticle,
  },
  {
    title: "Curriculum",
    description: "View curriculum guidelines",
    href: "/curriculum",
    icon: MdSchool,
  },
];

const recentActivities = [
  {
    title: "Updated Math lesson plan",
    time: "2 hours ago",
    icon: MdMenuBook,
  },
  {
    title: "Chat with Monica AI",
    time: "5 hours ago",
    icon: MdChat,
  },
  {
    title: "Downloaded teaching resources",
    time: "Yesterday",
    icon: MdArticle,
  },
];

const resources = [
  {
    title: "Teaching Best Practices",
    description: "Modern classroom techniques",
    href: "/resources/best-practices",
    icon: "📚",
  },
  {
    title: "Assessment Tools",
    description: "Student evaluation methods",
    href: "/resources/assessment",
    icon: "📝",
  },
  {
    title: "Digital Learning",
    description: "Technology in education",
    href: "/resources/digital",
    icon: "💻",
  },
];
