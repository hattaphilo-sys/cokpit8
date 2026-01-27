export type ProjectStatus = "hearing" | "concept" | "wireframe" | "design" | "delivery";
export type TaskStatus = "todo" | "in_progress" | "review" | "done";

export interface User {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "client";
  avatarUrl?: string;
}

export interface Project {
  _id: string;
  clientId: string;
  title: string;
  status: ProjectStatus;
  isPaymentPending: boolean;
  createdAt: number;
}

export interface Task {
  _id: string;
  projectId: string;
  title: string;
  status: TaskStatus;
  tags?: string[];
  dueDate?: number;
}

export type FileCategory = "artifact" | "shared_file";
export type FileType = "pdf" | "image" | "video" | "document" | "other";

export interface File {
  _id: string;
  projectId: string;
  name: string;
  category: FileCategory;
  type: FileType;
  size: number; // bytes
  uploadedBy: string; // user_id
  uploadedAt: number;
  url: string;
  thumbnailUrl?: string;
}


export const MOCK_USERS: User[] = [
  {
    _id: "user_client_1",
    name: "Alice Client",
    email: "alice@example.com",
    role: "client",
    avatarUrl: "https://github.com/shadcn.png"
  },
  {
    _id: "user_client_2",
    name: "Bob Anderson",
    email: "bob@techcorp.com",
    role: "client",
  },
  {
    _id: "user_client_3",
    name: "Carol Martinez",
    email: "carol@startup.io",
    role: "client",
  },
  {
    _id: "user_admin_1",
    name: "Admin User",
    email: "admin@cokpit.com",
    role: "admin",
  }
];

export const MOCK_USER: User = MOCK_USERS[0]; // For backward compatibility

export const MOCK_PROJECTS: Project[] = [
  {
    _id: "proj_1",
    clientId: "user_client_1",
    title: "C0KPIT Dashboard Redesign",
    status: "design", // Phase 4
    isPaymentPending: true,
    createdAt: Date.now() - 86400000 * 5
  },
  {
    _id: "proj_2",
    clientId: "user_client_2",
    title: "E-commerce Platform MVP",
    status: "wireframe", // Phase 3
    isPaymentPending: false,
    createdAt: Date.now() - 86400000 * 12
  },
  {
    _id: "proj_3",
    clientId: "user_client_3",
    title: "Mobile App Design System",
    status: "concept", // Phase 2
    isPaymentPending: false,
    createdAt: Date.now() - 86400000 * 3
  },
  {
    _id: "proj_4",
    clientId: "user_client_1",
    title: "Brand Identity Package",
    status: "delivery", // Phase 5
    isPaymentPending: false,
    createdAt: Date.now() - 86400000 * 30
  },
  {
    _id: "proj_5",
    clientId: "user_client_2",
    title: "SaaS Dashboard UI",
    status: "hearing", // Phase 1
    isPaymentPending: false,
    createdAt: Date.now() - 86400000 * 1
  }
];

export const MOCK_PROJECT: Project = MOCK_PROJECTS[0]; // For backward compatibility

export const MOCK_TASKS: Task[] = [
  { 
    _id: "task_1", 
    projectId: "proj_1", 
    title: "Approve Wireframes", 
    status: "done",
    tags: ["Design"]
  },
  { 
    _id: "task_2", 
    projectId: "proj_1", 
    title: "Review Visual Design", 
    status: "in_progress", 
    tags: ["Design", "Urgent"],
    dueDate: Date.now() + 86400000 
  },
  { 
    _id: "task_3", 
    projectId: "proj_1", 
    title: "Sign-off on Prototypes", 
    status: "review",
    tags: ["Review"],
    dueDate: Date.now() + 86400000 * 3
  },
  { 
    _id: "task_4", 
    projectId: "proj_1", 
    title: "Final Approval", 
    status: "todo",
    tags: ["Approval"]
  }
];

export const MOCK_INVOICE = {
  _id: "inv_1",
  projectId: "proj_1",
  amount: 350000,
  currency: "jpy" as const,
  stripePaymentLink: "https://stripe.com/mock",
  status: "pending" as const,
  issuedAt: Date.now()
};

export const MOCK_FILES: File[] = [
  // Artifacts (Admin uploaded deliverables)
  {
    _id: "file_1",
    projectId: "proj_1",
    name: "Final Design Mockups.pdf",
    category: "artifact",
    type: "pdf",
    size: 8524000,
    uploadedBy: "user_admin_1",
    uploadedAt: Date.now() - 86400000 * 2,
    url: "/mock/files/final-design-mockups.pdf",
  },
  {
    _id: "file_2",
    projectId: "proj_1",
    name: "Wireframe V2.fig",
    category: "artifact",
    type: "document",
    size: 12400000,
    uploadedBy: "user_admin_1",
    uploadedAt: Date.now() - 86400000 * 5,
    url: "/mock/files/wireframe-v2.fig",
  },
  {
    _id: "file_3",
    projectId: "proj_1",
    name: "Brand Guidelines.pdf",
    category: "artifact",
    type: "pdf",
    size: 4200000,
    uploadedBy: "user_admin_1",
    uploadedAt: Date.now() - 86400000 * 10,
    url: "/mock/files/brand-guidelines.pdf",
  },
  
  // Shared Files (Both admin and client can upload)
  {
    _id: "file_4",
    projectId: "proj_1",
    name: "Reference Images.zip",
    category: "shared_file",
    type: "other",
    size: 28500000,
    uploadedBy: "user_client_1",
    uploadedAt: Date.now() - 86400000 * 3,
    url: "/mock/files/reference-images.zip",
  },
  {
    _id: "file_5",
    projectId: "proj_1",
    name: "Logo Variations.ai",
    category: "shared_file",
    type: "image",
    size: 1800000,
    uploadedBy: "user_admin_1",
    uploadedAt: Date.now() - 86400000,
    url: "/mock/files/logo-variations.ai",
  },
  {
    _id: "file_6",
    projectId: "proj_1",
    name: "Project Brief.docx",
    category: "shared_file",
    type: "document",
    size: 450000,
    uploadedBy: "user_client_1",
    uploadedAt: Date.now() - 86400000 * 15,
    url: "/mock/files/project-brief.docx",
  },
];
