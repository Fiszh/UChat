export async function getPage(
    page: number = 1,
    start: number = 0,
    end: number = 100,
): Promise<false | PageCommit[]> {
    const res = await fetch(
        `https://api.github.com/repositories/872281543/commits?per_page=${end}&page=${page}&sha=main`,
    );

    if (!res.ok) return false;

    let data = (await res.json()) as PageCommit[] | undefined;

    if (!data) return false;

    if (start > 0) data = data.slice(start, end);

    return data;
}

export interface PageCommit {
    sha: string;
    node_id: string;
    commit: {
        author: Record<string, string>;
        committer: Record<string, string>;
        message: string;
        tree: Record<string, string>;
        url: string;
        comment_count: number;
        verification: Record<string, string | boolean | null>;
    };
    url: string;
    html_url: string;
    comments_url: string;
    author: Record<string, string | boolean | number>;
    committer: Record<string, string | boolean | number>;
    parents: Record<string, string>[];
}
