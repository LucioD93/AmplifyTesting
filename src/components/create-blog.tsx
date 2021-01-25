import React, { useState, FormEvent } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import callGraphQL from '../models/graphql';

import { createBlog } from "../graphql/mutations";
import { CreateBlogMutation, CreateBlogMutationVariables } from "../API";
import AppTextInput from './AppTextInput';

const CreateBlog = () => {
  const [name, setName] = useState<string>('');

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!!name ) saveBlog(name);
    setName('');
  };

  const saveBlog = async (name: string) => {
    try {
      const response = await callGraphQL<CreateBlogMutation>(createBlog, {
        input: { name },
      } as CreateBlogMutationVariables);
    } catch (error) {
      console.error("Error creating todo", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <View>
        <Text>
          New Blog
        </Text>
        <Text style={styles.label}>
          Blog Name:
          <AppTextInput
            leftIcon='account'
            value={name}
            onChangeText={text => setName(text)}
            placeholder="Enter blog name"
            autoCapitalize="none"
        />
        </Text>
      </View>
      <button type="submit">Save Blog</button>
    </form>
  );
};

export default CreateBlog;

const styles = StyleSheet.create({
  title: {
    fontSize: 15,
    fontWeight: 'bold'
  },
  label: {
    fontStyle: 'italic'
  }
})