import React from 'react';
import { Component, useEffect, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';

import { withAuthenticator } from 'aws-amplify-react-native';
import Amplify, { Auth, API, graphqlOperation } from 'aws-amplify';
import awsmobile from './src/aws-exports';

import { listBlogs } from './src/graphql/queries'
import callGraphQL, { subscribeGraphQL } from './src/models/graphql';
import { ListBlogsQuery, OnCreateBlogSubscription } from './src/API';
import Blog, { mapListBlogs, mapOnCreateBlogSubscription } from './src/models/blog';
import CreateBlog from './src/components/create-blog';
import { onCreateBlog } from './src/graphql/subscriptions';


const initialState = { name: '' }

Amplify.configure(awsmobile);

function App() {
  const [blogs, setBlogs] = useState<Blog[]>();

  useEffect(() => {
    async function getData() {
      try {
        const blogsData = await callGraphQL<ListBlogsQuery>(listBlogs);
        const blogs = mapListBlogs(blogsData);
        setBlogs(blogs);
      } catch (error) {
        console.error("Error fetching blogs", error);
      }
    }
    getData();
  }, []);

  const onCreateBlogHandler = (
    createBlogSubscription: OnCreateBlogSubscription
  ) => {
    const blog = mapOnCreateBlogSubscription(createBlogSubscription);
    setBlogs([...blogs, blog].sort((a, b) => (a.name?.toLowerCase() > b.name?.toLowerCase()) ? 1 : (a.name?.toLowerCase() === b.name?.toLowerCase()) ? ((a.id > b.id) ? 1 : -1) : -1 ));
  };

  useEffect(() => {
    const subscription = subscribeGraphQL<OnCreateBlogSubscription>(
      onCreateBlog,
      onCreateBlogHandler
    );

    return () => subscription.unsubscribe();
  }, [blogs]);

  const name = 'My Awesome Blog';


  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Blogs
      </Text>
      {blogs?.map((blog) => (
        <View key={blog.id} style={styles.blog}>
          <Text style={styles.blogName}>
            {blog.name} ({blog.id})
          </Text>
        </View>
      ))}

      <CreateBlog/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20
  },
  title: {
    fontSize: 25,
    textTransform: 'uppercase',
    textDecorationLine: 'underline',
    marginBottom: 5
  },
  blog: {
    marginBottom: 15
  },
  input: {
    height: 50,
    backgroundColor: '#ddd',
    marginBottom: 10,
    padding: 8
  },
  blogName: {
    fontSize: 18
  }
})

export default withAuthenticator(App, true);