import {
  check,
  checkMultiple,
  RESULTS,
  PERMISSIONS,
  request,
  requestMultiple,
} from 'react-native-permissions';

// export const checkPermissionAndroidCamera = async () => {
//   let status = false;

//   check(PERMISSIONS.ANDROID.CAMERA)
//     .then((result) => {
//       switch (result) {
//         case RESULTS.UNAVAILABLE:
//           console.log(
//             'This feature is not available (on this device / in this context)',
//           );
//           return status;

//         case RESULTS.DENIED:
//           console.log(
//             'The permission has not been requested / is denied but requestable',
//           );
//           // Alert.alert('Camera is not permitted, /n Check your setting');
//           // navigation.goBack();
//           return status;
//         case RESULTS.GRANTED:
//           console.log('The permission is granted');
//           status = true;
//           return status;

//         case RESULTS.BLOCKED:
//           console.log('The permission is denied and not requestable anymore');
//           // Alert.alert('Camera is not permitted, /n Check your setting');
//           // navigation.goBack();
//           return status;
//       }
//     })
//     .then((val) => console.log('PERM CAMERA ', val))
//     .catch((error) => {
//       console.log('Error Permissions : ', JSON.stringify(error));
//       return status;
//     });
// };

export const checkPermissionAndroidLocation = () => {
  requestMultiple([
    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
  ])
    .then((result) => {
      switch (result) {
        case RESULTS.UNAVAILABLE:
          console.log(
            'Location feature is not available (on this device / in this context)'
          );

          break;

        case RESULTS.DENIED:
          console.log(
            'Location permission has not been requested / is denied but requestable'
          );
          break;

        case RESULTS.GRANTED:
          console.log('Location permission is granted');
          break;

        case RESULTS.BLOCKED:
          console.log(
            'Location permission is denied and not requestable anymore'
          );
          break;
      }
    })
    .catch((error) => {
      console.log(
        'Location Error Permissions : ',
        JSON.stringify(error)
      );
    });
};

export const requestAllRequiredPermission = () => {
  requestMultiple([
    PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION,
    PERMISSIONS.ANDROID.ACCESS_COARSE_LOCATION,
    PERMISSIONS.ANDROID.ACCESS_MEDIA_LOCATION,
    PERMISSIONS.ANDROID.WRITE_EXTERNAL_STORAGE,
    PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
    PERMISSIONS.ANDROID.CAMERA,
  ])
    .then((statuses) => {
      console.log(
        'LOCATION FINE',
        statuses[PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION]
      );
      console.log(
        'LOCATION BACKGROUND',
        statuses[PERMISSIONS.ANDROID.ACCESS_BACKGROUND_LOCATION]
      );

      console.log(
        'READ STORAGE',
        statuses[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE]
      );
      console.log('CAMERA ', statuses[PERMISSIONS.ANDROID.CAMERA]);
    })
    .catch((e) => {
      console.log('FCK YOU BOI : ', e);
    });
};
