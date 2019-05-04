import {User} from './user.model';
import {Project} from './project.model';


export interface ParsedWorkerApplication {
  id: number;
  worker_id: User;
  project_id: number;
  team: number;
  role: string;
  status: number;
  comment: string | null;
}

export interface Applications {
  per_page: number;
  page: number;
  pages: number;
  data: ParsedProjectApplication[];
}

export interface ParsedProjectApplication {
  id: number;
  worker_id: number;
  project_id: Project;
  team: number;
  role: string;
  status: number;
  comment: string | null;
}
