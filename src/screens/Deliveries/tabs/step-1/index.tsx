import { Formik } from 'formik';
import type { FormikProps } from 'formik';
import { useAtom, useSetAtom } from 'jotai';
import moment from 'moment';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Ionicon from 'react-native-vector-icons/Ionicons';
import { toFormikValidationSchema } from 'zod-formik-adapter';
import {
  DeliveryStep1Props,
  Step1Form,
  Step1FormSchema,
  getInitialValues,
  initialState,
} from './form';
import { authAtom, newDeliveryAtom } from '@/src/atom';
import { Container } from '@/src/components/container';
import { DateTimePicker } from '@/src/components/date-time-picker';
import { DropDownPicker } from '@/src/components/drop-down-picker';
import { BottomModal } from '@/src/components/modal';
import { PrimaryButton } from '@/src/components/primary-button';
import {
  createStep1Atom,
  deliveryConditionAtom,
  deliveryStatusAtom,
  driverAtom,
  hubAtom,
  storeAtom,
} from '@/src/queries';
import {
  DeliveryCondition,
  DeliveryStatus,
  Driver,
  Hub,
  Step1Delivery,
  Store,
} from '@/src/schema';
import { storeData } from '@/src/services';
import { Colors } from '@/src/themes/colors';
const DeliveryStep1 = ({
  onSubmit,
  isReset,
}: DeliveryStep1Props): JSX.Element => {
  const [hubStateVisible, setHubStateVisible] = useState(false);
  const [driverStateVisible, setDriverStateVisible] = useState(false);
  const [storeStateVisible, setStoreStateVisible] = useState(false);
  const [deliveryStateVisible, setDeliveryStateVisible] =
    useState(false);
  const [deliveryConditionVisible, setDeliveryConditionVisible] =
    useState(false);
  const [state, setState] = useState(initialState);
  const formikRef = useRef<FormikProps<Step1FormSchema>>(null);
  const scrollRef = useRef<ScrollView>(null);
  const [auth] = useAtom(authAtom);
  const setNewDelivery = useSetAtom(newDeliveryAtom);

  const [
    {
      data: hubData,
      isLoading: hubIsLoading,
      isError: hubIsError,
      refetch: hubRefetch,
    },
  ] = useAtom(hubAtom);
  const [
    {
      data: driverData,
      isLoading: driverIsLoading,
      isError: driverIsError,
      refetch: driverRefetch,
    },
  ] = useAtom(driverAtom);
  const [
    {
      data: physicalStoreData,
      isLoading: storeIsLoading,
      isError: storeIsError,
      refetch: storeRefetch,
    },
  ] = useAtom(storeAtom);
  const [
    {
      data: deliveryStatusData,
      isLoading: deliveryStatusIsLoading,
      isError: deliveryStatusIsError,
      refetch: deliveryStatusRefetch,
    },
  ] = useAtom(deliveryStatusAtom);
  const [
    {
      data: deliveryConditionData,
      isLoading: deliveryConditionIsLoading,
      isError: deliveryConditionIsError,
      refetch: deliveryConditionRefetch,
    },
  ] = useAtom(deliveryConditionAtom);
  const [
    {
      data: createDeliveryData,
      isError: createDeliveryIsError,
      mutate: createDeliveryMutate,
    },
  ] = useAtom(createStep1Atom);

  const onHubToggle = (): void => setHubStateVisible((prev) => !prev);
  const onDriverToggle = (): void =>
    setDriverStateVisible((prev) => !prev);
  const onStoreToggle = (): void =>
    setStoreStateVisible((prev) => !prev);
  const onDeliveryConditionToggle = (): void =>
    setDeliveryConditionVisible((prev) => !prev);
  const onDeliveryStatusToggle = (): void =>
    setDeliveryStateVisible((prev) => !prev);
  const handleFormSubmit = async (
    values: Step1Form
  ): Promise<void> => {
    const delivery = {
      hub_code:
        auth?.user?.hub_code ?? Number(state.hub_details.hub_id),
      branch_name: state.store_details.store_name,
      time_in: values.entry_date_and_time,
      time_out: values.entry_date_and_time,
      delivery_status_code:
        state.delivery_status_details.delivery_status_code,
      truck_code_license:
        auth?.user.truck_license ??
        state.driver_details.license_plate,
      condition_code: state.delivery_condition_details.condition_code,
      store_code: state.store_details.store_code,
      user_id: Number(auth?.user.id ?? 0),
      driver_name:
        auth?.user.driver_name ?? state.driver_details.driver_name,
    };

    createDeliveryMutate(delivery);
  };

  const saveDataToStorage = async (
    data: Step1Delivery
  ): Promise<void> => {
    storeData('new_delivery', data);
  };

  useEffect(() => {
    if (createDeliveryData && !createDeliveryIsError) {
      setNewDelivery({
        ...createDeliveryData,
      });
      saveDataToStorage(createDeliveryData);

      onSubmit();
    }
  }, [createDeliveryData, createDeliveryIsError]);

  useEffect(() => {
    if (isReset) {
      setState(initialState);
      formikRef?.current?.setValues(
        getInitialValues(auth?.user.driver_name, auth?.user?.hub_code)
      );
      formikRef?.current?.setErrors(getInitialValues());
      scrollRef.current?.scrollTo({ x: 0, y: 0, animated: true });
    }
  }, [isReset]);

  return (
    <Container style={{ flex: 1, paddingHorizontal: 15 }}>
      <BottomModal
        visible={hubStateVisible}
        loading={hubIsLoading}
        onTouchOutside={onHubToggle}
        title="Choose Hub"
        error={hubIsError}
        content={hubData as unknown as Hub[]}
        refetch={hubRefetch}
        onSelect={(
          val:
            | Store
            | Hub
            | Driver
            | DeliveryStatus
            | DeliveryCondition
        ): void => {
          setState({ ...state, hub_details: val as Hub });
          formikRef?.current?.setFieldError('hub_id', '');
          formikRef?.current?.setFieldValue(
            'hub_id',
            (val as Hub).hub_description
          );
        }}
      />

      <BottomModal
        visible={driverStateVisible}
        loading={driverIsLoading}
        onTouchOutside={onDriverToggle}
        title="Choose Driver"
        error={driverIsError}
        content={driverData as unknown as Driver[]}
        refetch={driverRefetch}
        onSelect={(
          val:
            | Store
            | Hub
            | Driver
            | DeliveryStatus
            | DeliveryCondition
        ): void => {
          setState({ ...state, driver_details: val as Driver });
          formikRef?.current?.setFieldValue(
            'senders_name',
            (val as Driver).driver_name
          );
          formikRef?.current?.setFieldError('senders_name', '');
        }}
      />

      <BottomModal
        visible={storeStateVisible}
        loading={storeIsLoading}
        onTouchOutside={onStoreToggle}
        title="Choose Store"
        error={storeIsError}
        content={physicalStoreData as unknown as Store[]}
        onSelect={(
          val:
            | Store
            | Hub
            | Driver
            | DeliveryStatus
            | DeliveryCondition
        ): void => {
          setState({ ...state, store_details: val as Store });
          formikRef?.current?.setFieldValue(
            'name_of_sending_branch',
            (val as Store).store_name
          );
          formikRef?.current?.setFieldError(
            'name_of_sending_branch',
            ''
          );
        }}
        refetch={storeRefetch}
      />

      <BottomModal
        visible={deliveryConditionVisible}
        loading={deliveryConditionIsLoading}
        onTouchOutside={onDeliveryConditionToggle}
        title="Choose Delivery Status"
        error={deliveryConditionIsError}
        content={
          deliveryConditionData as unknown as DeliveryCondition[]
        }
        onSelect={(
          val:
            | Store
            | Hub
            | Driver
            | DeliveryStatus
            | DeliveryCondition
        ): void => {
          setState({
            ...state,
            delivery_condition_details: val as DeliveryCondition,
          });
          formikRef?.current?.setFieldValue(
            'delivery_condition',
            (val as DeliveryCondition).condition_description
          );
          formikRef?.current?.setFieldError('delivery_condition', '');
        }}
        refetch={deliveryConditionRefetch}
      />
      <BottomModal
        visible={deliveryStateVisible}
        loading={deliveryStatusIsLoading}
        onTouchOutside={onDeliveryStatusToggle}
        title="Choose Delivery Status"
        error={deliveryStatusIsError}
        content={deliveryStatusData as unknown as DeliveryStatus[]}
        onSelect={(
          val:
            | Store
            | Hub
            | Driver
            | DeliveryStatus
            | DeliveryCondition
        ): void => {
          setState({
            ...state,
            delivery_status_details: val as DeliveryStatus,
          });
          formikRef?.current?.setFieldValue(
            'delivery_status',
            (val as DeliveryStatus).status_eng
          );
          formikRef?.current?.setFieldError('delivery_status', '');
        }}
        refetch={deliveryStatusRefetch}
      />
      <Formik
        innerRef={formikRef}
        initialValues={getInitialValues(
          auth?.user.driver_name,
          auth?.user?.hub_code
        )}
        onSubmit={handleFormSubmit}
        enableReinitialize
        validateOnChange={false}
        validateOnBlur={false}
        validationSchema={toFormikValidationSchema(Step1Form)}
      >
        {({
          setFieldValue,
          setFieldError,
          values,
          handleSubmit,
          errors,
        }): ReactNode => (
          <>
            <ScrollView
              showsVerticalScrollIndicator={false}
              ref={scrollRef}
            >
              <>
                <DropDownPicker
                  title="Hub_ID"
                  placeholder="Click here"
                  value={values.hub_id}
                  onPress={(): void => onHubToggle()}
                  error={errors.hub_id}
                  disabled={!!auth?.user.hub_code}
                  rightIcon={
                    <Ionicon
                      name={'chevron-down-outline'}
                      size={22}
                      color={Colors.primary}
                    />
                  }
                />

                <DropDownPicker
                  title="Sender's Name"
                  placeholder="Click here"
                  value={values.senders_name}
                  onPress={(): void => onDriverToggle()}
                  error={errors.senders_name}
                  disabled={!!auth?.user.driver_name}
                  rightIcon={
                    <Ionicon
                      name={'chevron-down-outline'}
                      size={22}
                      color={Colors.primary}
                    />
                  }
                />

                <DropDownPicker
                  title="Driver's License Plate"
                  placeholder="Click here"
                  value={
                    auth?.user.truck_license ??
                    state.driver_details.license_plate
                  }
                  onPress={(): void => {}}
                  disabled={!!auth?.user?.truck_license}
                  rightIcon={
                    <Ionicon
                      name={'chevron-down-outline'}
                      size={22}
                      color={Colors.primary}
                    />
                  }
                />

                <DropDownPicker
                  title="Branch Name"
                  placeholder="Click here"
                  value={values.name_of_sending_branch}
                  onPress={(): void => onStoreToggle()}
                  error={errors.name_of_sending_branch}
                  rightIcon={
                    <Ionicon
                      name={'chevron-down-outline'}
                      size={22}
                      color={Colors.primary}
                    />
                  }
                />
                <DateTimePicker
                  title="Time In:"
                  placeholder="Choose Date"
                  value={values.entry_date_and_time}
                  minDate={moment().subtract(1, 'days').toDate()}
                  maxDate={new Date()}
                  onSelect={(val: string): void => {
                    setState({
                      ...state,
                      issue_date: val,
                      entry_date_time: val,
                    });
                    setFieldError('entry_date_and_time', '');
                    setFieldValue('entry_date_and_time', val);
                  }}
                  error={errors.entry_date_and_time}
                />

                <DropDownPicker
                  title="Delivery Condition"
                  placeholder="Click here"
                  value={values.delivery_condition}
                  onPress={(): void => onDeliveryConditionToggle()}
                  error={errors.delivery_condition}
                  rightIcon={
                    <Ionicon
                      name={'chevron-down-outline'}
                      size={22}
                      color={Colors.primary}
                    />
                  }
                />

                <DropDownPicker
                  title="Delivery Status"
                  placeholder="Click here"
                  value={values.delivery_status}
                  onPress={(): void => onDeliveryStatusToggle()}
                  error={errors.delivery_status}
                  rightIcon={
                    <Ionicon
                      name={'chevron-down-outline'}
                      size={22}
                      color={Colors.primary}
                    />
                  }
                />

                <View style={{ height: hp('10%') }} />
              </>
            </ScrollView>
            <PrimaryButton onSubmit={handleSubmit} title="Submit" />
          </>
        )}
      </Formik>
    </Container>
  );
};

export default DeliveryStep1;
