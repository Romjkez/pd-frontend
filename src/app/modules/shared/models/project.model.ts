import {User} from './user.model';

export interface ProjectDocument {
  id: number;
  title: string;
  link: string;
}

export interface Project {
  id: number;
  title: string;
  description: string;
  members: User[];
  deadline: string;
  finish_date: string;
  curator: User;
  tags: string;
  status: string;
  adm_comment: string | null;
  files: ProjectDocument[];
  avatar: string;
}

export interface Projects {
  page: number;
  per_page: number;
  pages: number;
  data: Project[] | null;
}

export interface UserProjects {
  active_projects: Project[];
  finished_projects: Project[];
}
