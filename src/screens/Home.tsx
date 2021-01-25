import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { Auth } from 'aws-amplify';
export default function Home({ updateAuthState }) {
  async function signOut() {
    try {
      await Auth.signOut();
      updateAuthState('loggedOut');
    } catch (error) {
      console.log('Error signing out: ', error);
    }
  }
  return (
    <View style={styles.container}>
      <Text> <img draggable="false" class="emoji" alt="💙" src="https://s.w.org/images/core/emoji/11/svg/1f499.svg"/> + <img draggable="false" class="emoji" alt="💛" src="https://s.w.org/images/core/emoji/11/svg/1f49b.svg"/></Text>
      <Button title="Sign Out" color="tomato" onPress={signOut} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    marginTop: 20
  }
});