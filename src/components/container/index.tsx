import React, { FC, ReactNode } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  View,
  ViewProps,
} from 'react-native';
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

export interface ContainerProps extends ViewProps {
  children: ReactNode;
  scrollView?: boolean;
  isLoading?: boolean;
}

export const Container: FC<ContainerProps> = ({
  children,
  isLoading,
  scrollView,
  ...props
}) => {
  if (isLoading) {
    return (
      <View style={styles.viewContainer}>
        <ActivityIndicator color="$border" />
      </View>
    );
  }

  if (scrollView) {
    return (
      <KeyboardAvoidingView
        style={[styles.scrollView]}
        behavior="padding"
        keyboardVerticalOffset={50}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          scrollIndicatorInsets={{ right: 1 }}
          keyboardShouldPersistTaps="handled"
          {...props}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <View style={styles.viewContainer} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white',
    justifyContent: 'center',
    padding: wp(5),
  },
  viewContainer: {
    flex: 1,
    backgroundColor: 'white',
    padding: wp(5),
  },
});
