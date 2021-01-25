import { ListBlogsQuery, OnCreateBlogSubscription } from '../API';
import { GraphQLResult } from '@aws-amplify/api';

interface Blog {
  id?: string;
  name?: string;
}

function mapListBlogsQuery(listBlogsQuery: GraphQLResult<ListBlogsQuery>): Blog[] {
  return listBlogsQuery.data?.listBlogs?.items?.map(blog => ({
    id: blog?.id,
    name: blog?.name
  } as Blog)).sort((a, b) => (a.name?.toLowerCase() > b.name?.toLowerCase()) ? 1 : (a.name?.toLowerCase() === b.name?.toLowerCase()) ? ((a.id > b.id) ? 1 : -1) : -1 ) || []
}

function mapOnCreateBlogSubscription(createBlogSubscription: OnCreateBlogSubscription): Blog {
    const { id, name } = createBlogSubscription.onCreateBlog || {};
    return {
      id, name
    } as Blog
  }

export default Blog;
export { mapListBlogsQuery as mapListBlogs, mapOnCreateBlogSubscription }