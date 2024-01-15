export interface UpdateBlogPost{
    title: string;
    shortDescription: string;
    content: string;
    featuredImageUrl: string;
    urlHandle: string;
    
    publishedate: Date;
    author: string;
    isVisible: boolean;
    categories: string[];
}