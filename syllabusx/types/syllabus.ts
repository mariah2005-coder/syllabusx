export interface TopicChunk {
  id: string;
  title: string;
  content: string;
}

export interface Syllabus {
  fileName: string;
  pageCount: number;
  topics: TopicChunk[];
}
