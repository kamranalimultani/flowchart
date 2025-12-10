export interface FlowTemplate {
    id: number;
    title: string;
    slug?: string; // Opt-in initially as older templates might not have it immediately if migration didn't backfill, but new ones will. Backend logic implies new ones do.
    description: string;
    xml_file_path: string;
    thumbnail_path: string | null;
    tags: string[]; // Array of strings
    created_at: string;
    updated_at: string;
}
