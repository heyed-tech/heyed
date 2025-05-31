"use client"

import { Switch } from "@/components/ui/switch"

import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"

import { useState } from "react"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Search,
  Users,
  CheckCircle2,
  FileCheck,
  AlertCircle,
  Lock,
  UserCircle,
  Clock,
  ChevronDown,
  Mail,
  Filter,
  MoreVertical,
  ChevronRight,
} from "lucide-react"

export default function HeroIllustration() {
  const [activeFilters, setActiveFilters] = useState({
    showVerified: true,
    showPending: true,
  })

  return (
    <div className="w-full px-4 sm:pl-8 lg:pl-0">
      <div className="relative rounded-2xl p-4 sm:p-8 overflow-visible min-h-[500px] sm:min-h-[600px] lg:w-[120%] lg:-mr-16">
        {/* Main content stack */}
        <div className="relative mx-auto max-w-3xl lg:ml-0 lg:scale-100">
          {/* Back Layer - Staff List */}
          <div className="absolute top-8 sm:top-12 left-4 right-4 sm:left-12 sm:right-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 transform -rotate-12 z-10 border border-slate-200/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-teal-500" />
                <h3 className="font-semibold text-slate-800 text-sm sm:text-base">Staff Overview</h3>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent asChild>
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="w-48 rounded-xl bg-white p-1 shadow-lg border z-50"
                  >
                    <DropdownMenuItem className="flex items-center justify-between rounded-lg">
                      Show Verified
                      <Switch
                        checked={activeFilters.showVerified}
                        onCheckedChange={(checked) => setActiveFilters((prev) => ({ ...prev, showVerified: checked }))}
                      />
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex items-center justify-between rounded-lg">
                      Show Pending
                      <Switch
                        checked={activeFilters.showPending}
                        onCheckedChange={(checked) => setActiveFilters((prev) => ({ ...prev, showPending: checked }))}
                      />
                    </DropdownMenuItem>
                  </motion.div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="space-y-2 sm:space-y-3">
              {[
                { name: "Sarah Hughes", role: "Admin", compliance: 58 },
                { name: "Emma Mitchell", role: "Staff", compliance: 90 },
                { name: "David Wilson", role: "Staff", compliance: 42 },
              ].map((staff, i) => (
                <div
                  key={i}
                  className="group bg-white rounded-xl border border-slate-100 p-2 sm:p-3 flex items-center justify-between hover:border-teal-500 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-teal-50 flex items-center justify-center text-teal-600 text-sm sm:text-base font-medium">
                      {staff.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <div className="font-medium text-slate-800 text-sm sm:text-base">{staff.name}</div>
                      <div className="text-xs sm:text-sm text-slate-500">{staff.role}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 sm:gap-3">
                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-teal-50 text-teal-600">
                      {staff.compliance}%
                    </span>
                    <ChevronRight className="h-4 w-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Middle Layer - Document Verification */}
          <div className="absolute top-4 sm:top-6 left-0 right-0 bg-gradient-to-b from-white to-slate-50/95 backdrop-blur-sm rounded-2xl shadow-xl p-4 sm:p-6 transform rotate-6 z-20 border border-slate-200/50">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <FileCheck className="h-4 w-4 sm:h-5 sm:w-5 text-teal-500" />
                <h3 className="font-semibold text-slate-800 text-sm sm:text-base">Required Documents</h3>
              </div>
              <Badge variant="outline" className="bg-teal-50 text-teal-500 border-teal-200 text-xs sm:text-sm">
                8 Pending
              </Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {[
                { title: "ID Verification", status: "complete", date: "Verified 2 days ago" },
                { title: "Right to Work", status: "pending", date: "Due by Mar 15" },
                { title: "Enhanced DBS", status: "complete", date: "Verified 1 week ago" },
              ].map((doc, i) => (
                <div
                  key={i}
                  className={`group p-3 sm:p-4 rounded-lg border ${
                    doc.status === "complete" ? "bg-teal-50/50 border-teal-100" : "bg-amber-50/50 border-amber-100"
                  } hover:shadow-md hover:border-teal-500 transition-all duration-200 cursor-pointer`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-slate-800 text-sm sm:text-base">{doc.title}</h4>
                    {doc.status === "complete" ? (
                      <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-teal-500" />
                    ) : (
                      <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600">{doc.date}</p>
                  <div className="h-1 w-full bg-slate-100 rounded-full mt-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        doc.status === "complete" ? "w-full bg-teal-500" : "w-[60%] bg-amber-500"
                      }`}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Front Layer - Profile Card */}
          <div className="relative bg-white rounded-2xl shadow-xl p-4 sm:p-6 z-30 border border-slate-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-4 sm:gap-6 mb-4 sm:mb-6">
              <div className="relative group">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-500 text-xl sm:text-2xl font-semibold">
                  RC
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-teal-500 border-2 border-white flex items-center justify-center">
                  <CheckCircle2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-semibold text-slate-800">Rachelle Joyce</h2>
                    <p className="text-xs sm:text-sm text-slate-500">#1001 • Manager</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-full text-sm font-medium bg-teal-50 text-teal-600">
                    100%
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-2 text-xs sm:text-sm text-slate-600">
                  <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-teal-500" />
                  <span className="truncate">r.joyce@brightstars.co.uk</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {[
                { icon: Clock, label: "Start Date", value: "1 Sept 2023" },
                { icon: UserCircle, label: "Staff Type", value: "Manager" },
                { icon: Users, label: "Status", value: "Full Time" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="group p-2 sm:p-3 rounded-xl border border-slate-100 hover:border-teal-500 hover:shadow-md transition-all duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-slate-500 mb-1">
                    <item.icon className="h-3 w-3 sm:h-4 sm:w-4 text-teal-500" />
                    {item.label}
                  </div>
                  <div className="font-medium text-slate-800 text-sm sm:text-base truncate">{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Search bar - floating element */}
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 z-40 transition-transform duration-300 group-hover:translate-y-2 w-[90%] sm:w-auto">
            <div className="bg-white rounded-xl shadow-lg p-2 px-3 sm:px-4 flex items-center gap-2 sm:gap-3 border border-slate-100 hover:border-teal-500 hover:shadow-xl transition-all duration-200 whitespace-nowrap min-w-[250px] sm:min-w-[300px]">
              <Search className="h-3 w-3 sm:h-4 sm:w-4 text-teal-500" />
              <span className="text-slate-400 text-xs sm:text-sm">Search staff records...</span>
              <div className="h-4 border-l border-slate-200"></div>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2">
                  <Filter className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400" />
                  <span className="text-xs sm:text-sm text-slate-600">All Roles</span>
                  <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4 text-slate-400" />
                </DropdownMenuTrigger>
                <DropdownMenuContent asChild>
                  <motion.div
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-xl bg-white p-1 shadow-lg border z-50"
                  >
                    <DropdownMenuItem className="rounded-lg">Head Office</DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg">Admin</DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg">Manager</DropdownMenuItem>
                    <DropdownMenuItem className="rounded-lg">Staff</DropdownMenuItem>
                  </motion.div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* Floating Elements - Adjusted positions for better spacing */}
          <div className="absolute -left-2 sm:-left-4 lg:-left-8 bottom-20 transform -rotate-12 z-50 transition-transform duration-300">
            <div className="bg-white rounded-lg shadow-lg p-1.5 sm:p-2 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
              <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-teal-500" />
            </div>
          </div>
          <div className="absolute -right-2 lg:-right-4 bottom-32 transform rotate-12 z-50 transition-transform duration-300">
            <div className="bg-teal-500 rounded-lg shadow-lg p-1.5 sm:p-2 hover:shadow-xl hover:-translate-y-1 transition-all duration-200">
              <Lock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
