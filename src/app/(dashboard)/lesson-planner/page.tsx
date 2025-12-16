"use client";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui";

export default function LessonPlannerPage() {
  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-color3">
          Lesson Planner
        </h1>
        <p className="text-gray-600 mt-2">
          Create and organize your lesson plans efficiently.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Lesson Categories */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Your Lessons</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {lessonCategories.map((category, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg border border-gray-100 hover:border-color1 hover:shadow-sm transition-all cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-color1/10 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">{category.icon}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-color3">
                          {category.title}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {category.lessons} lessons
                        </p>
                      </div>
                      <span className="text-color1 font-semibold">
                        {category.progress}%
                      </span>
                    </div>
                    <div className="mt-3 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-color1 rounded-full transition-all"
                        style={{ width: `${category.progress}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <button className="w-full p-3 text-left rounded-lg bg-color1 text-color3 font-semibold hover:bg-color1/90 transition-colors">
                  + Create New Lesson
                </button>
                <button className="w-full p-3 text-left rounded-lg border border-gray-200 text-color3 hover:border-color1 hover:bg-color1/5 transition-colors">
                  Import Lesson Plan
                </button>
                <button className="w-full p-3 text-left rounded-lg border border-gray-200 text-color3 hover:border-color1 hover:bg-color1/5 transition-colors">
                  Browse Templates
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {weekSchedule.map((day, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 rounded hover:bg-gray-50"
                  >
                    <span className="font-medium text-color3">{day.day}</span>
                    <span className="text-sm text-gray-500">
                      {day.lessons} lessons
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

const lessonCategories = [
  { title: "Mathematics", icon: "📐", lessons: 12, progress: 75 },
  { title: "Science", icon: "🔬", lessons: 8, progress: 50 },
  { title: "English", icon: "📖", lessons: 10, progress: 80 },
  { title: "Social Studies", icon: "🌍", lessons: 6, progress: 30 },
];

const weekSchedule = [
  { day: "Monday", lessons: 4 },
  { day: "Tuesday", lessons: 5 },
  { day: "Wednesday", lessons: 3 },
  { day: "Thursday", lessons: 5 },
  { day: "Friday", lessons: 4 },
];
