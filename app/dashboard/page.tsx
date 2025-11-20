'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, Badge } from '@/components/ui/index';
import { CheckCircle2, Circle, Trash2, Plus } from 'lucide-react';
import Button from '@/components/ui/Button';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
}

interface Stats {
  totalContacts: number;
  openDeals: number;
  conversionRate: number;
  newLeads: number;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Follow up with Acme Corp', completed: false, priority: 'high' },
    { id: '2', title: 'Prepare proposal for TechStart', completed: true, priority: 'high' },
    { id: '3', title: 'Schedule demo call', completed: false, priority: 'medium' },
    { id: '4', title: 'Update contact database', completed: true, priority: 'low' },
    { id: '5', title: 'Review sales metrics', completed: false, priority: 'medium' },
  ]);

  const [newTask, setNewTask] = useState('');
  const [stats, setStats] = useState<Stats>({
    totalContacts: 0,
    openDeals: 0,
    conversionRate: 32,
    newLeads: 0,
  });

  // Fetch stats from API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/contacts');
        if (response.ok) {
          const data = await response.json();
          setStats(prev => ({
            ...prev,
            totalContacts: data.total || 0,
          }));
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      }
    };

    fetchStats();
  }, []);

  const toggleTask = (id: string) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([
        ...tasks,
        {
          id: Date.now().toString(),
          title: newTask,
          completed: false,
          priority: 'medium',
        },
      ]);
      setNewTask('');
    }
  };

  const completedCount = tasks.filter(t => t.completed).length;
  const completionRate = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const statCards = [
    { label: 'Total Contacts', value: stats.totalContacts.toString(), trend: '+12%', icon: '👥' },
    { label: 'Open Deals', value: '$2.5M', trend: '+8%', icon: '💼' },
    { label: 'Conversion Rate', value: `${stats.conversionRate}%`, trend: '+2%', icon: '📊' },
    { label: 'New Leads', value: stats.newLeads.toString(), trend: '+25%', icon: '🔔' },
  ];

  return (
    <div className="space-y-8 p-6">
      {/* Welcome Section */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-2">
            Welcome back, {session?.user?.name?.split(' ')[0]}! 👋
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Here's what's happening with your business today.
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-neutral-600 dark:text-neutral-400">Tasks Progress</div>
          <div className="text-3xl font-bold text-primary-600">{completionRate}%</div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <Card key={index} hover>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl">{stat.icon}</span>
                <Badge variant="success" className="text-xs">
                  {stat.trend}
                </Badge>
              </div>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-1">
                {stat.label}
              </p>
              <p className="text-2xl font-bold text-neutral-900 dark:text-white">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Tasks Checklist */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-neutral-900 dark:text-white text-lg">
                📋 Task Checklist
              </h2>
            </CardHeader>
            <CardContent>
              {/* Add Task */}
              <div className="flex gap-2 mb-6">
                <input
                  type="text"
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  placeholder="Add a new task..."
                  className="flex-1 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-900 dark:text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <Button onClick={addTask} className="px-4">
                  <Plus size={18} />
                </Button>
              </div>

              {/* Task List */}
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {tasks.length === 0 ? (
                  <p className="text-center py-8 text-neutral-500">No tasks yet. Add one to get started!</p>
                ) : (
                  tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 transition ${
                        task.completed
                          ? 'bg-success-50 dark:bg-success-900/10 border-success-200 dark:border-success-800'
                          : 'bg-neutral-50 dark:bg-neutral-900/50 border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-700'
                      }`}
                    >
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="flex-shrink-0 transition"
                      >
                        {task.completed ? (
                          <CheckCircle2 size={24} className="text-success-600" />
                        ) : (
                          <Circle size={24} className="text-neutral-400 hover:text-primary-500" />
                        )}
                      </button>

                      <div className="flex-1 min-w-0">
                        <p
                          className={`font-medium transition ${
                            task.completed
                              ? 'line-through text-neutral-500'
                              : 'text-neutral-900 dark:text-white'
                          }`}
                        >
                          {task.title}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        <Badge
                          variant={
                            task.priority === 'high'
                              ? 'danger'
                              : task.priority === 'medium'
                              ? 'warning'
                              : 'success'
                          }
                          className="text-xs"
                        >
                          {task.priority}
                        </Badge>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="text-neutral-400 hover:text-danger-600 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Progress Bar */}
              {tasks.length > 0 && (
                <div className="mt-6 pt-6 border-t border-neutral-200 dark:border-neutral-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      Completion
                    </span>
                    <span className="text-sm font-bold text-primary-600">
                      {completedCount}/{tasks.length}
                    </span>
                  </div>
                  <div className="w-full h-3 bg-neutral-200 dark:bg-neutral-700 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-primary-500 to-primary-600 transition-all duration-300"
                      style={{ width: `${completionRate}%` }}
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Activity & Alerts */}
        <div className="space-y-6">
          {/* Top Deals */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-neutral-900 dark:text-white">
                🎯 Top Deals
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { name: 'Enterprise Package', amount: '$125,000', stage: 'Proposal' },
                  { name: 'Standard Plan', amount: '$45,000', stage: 'Negotiation' },
                  { name: 'Growth Package', amount: '$85,000', stage: 'Qualification' },
                ].map((deal, i) => (
                  <div key={i} className="pb-4 border-b border-neutral-200 dark:border-neutral-700 last:border-0 last:pb-0">
                    <p className="font-medium text-neutral-900 dark:text-white text-sm">
                      {deal.name}
                    </p>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-2">
                      {deal.stage}
                    </p>
                    <p className="font-bold text-primary-600">{deal.amount}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <h2 className="font-semibold text-neutral-900 dark:text-white">
                ⚡ Quick Actions
              </h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { label: 'Add Contact', icon: '➕', href: '/dashboard/contacts' },
                  { label: 'Create Deal', icon: '💰', href: '/dashboard/deals' },
                  { label: 'View Reports', icon: '📈', href: '#' },
                  { label: 'Settings', icon: '⚙️', href: '/dashboard/settings' },
                ].map((action, i) => (
                  <a
                    key={i}
                    href={action.href}
                    className="flex items-center gap-3 p-3 rounded-lg bg-neutral-50 dark:bg-neutral-900/50 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition border border-neutral-200 dark:border-neutral-700 hover:border-primary-300 dark:hover:border-primary-700"
                  >
                    <span className="text-xl">{action.icon}</span>
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                      {action.label}
                    </span>
                  </a>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

