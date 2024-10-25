export interface ChatHistory {
  content: string | string[];
  role: "user" | "ai";
  expression_media?: ExpressionMedia;
  image?: string;
}

export interface ExpressionMedia {
  audioUrl: string;
  duration: string;
  words: Word[];
}

export interface Word {
  endTime: string;
  startTime: string;
  word: string;
}
