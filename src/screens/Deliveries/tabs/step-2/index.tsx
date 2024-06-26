import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import {
  DeliveryStep2Props,
  OPERATOR,
  TYPE,
  initialState,
} from './form';
import { Container } from '@/src/components/container';
import { CounterButton } from '@/src/components/counter-button';
import { PrimaryButton } from '@/src/components/primary-button';
import {
  DeliveryItemSuccessResult,
  createStep2Atom,
  deliveryItemAtom,
} from '@/src/queries';

const DeliveryStep2 = ({
  onSubmit,
  isReset,
  isActive,
}: DeliveryStep2Props): JSX.Element => {
  const [state, setState] = useState(initialState);
  const [{ data: deliveryItemData, refetch }] =
    useAtom(deliveryItemAtom);
  const handleOnChange = (
    opr: OPERATOR,
    type: TYPE,
    value?: string
  ): void => {
    setState({
      ...state,
      [type]:
        opr === 'manual'
          ? Number(value ?? 0)
          : opr === 'add'
          ? state[type] + 1
          : state[type] - 1,
    });
  };

  const handleOnChangeNote = (text: string): void =>
    setState({ ...state, notes: text });

  const [
    {
      data: updateDeliveryData,
      isError: updateDeliveryIsError,
      mutate: updateDeliveryMutate,
    },
  ] = useAtom(createStep2Atom);

  const handleOnPressSubmit = (): void => {
    const updateParamData = {
      ...deliveryItemData,
      green_basket: state.number_of_green_basket,
      tray_sent_out: state.number_of_trays_sent,
      tray_received_store: state.number_of_trays_received,
      notes: state.notes,
    };
    updateDeliveryMutate(
      updateParamData as DeliveryItemSuccessResult
    );
  };

  useEffect(() => {
    if (updateDeliveryData && !updateDeliveryIsError) {
      onSubmit();
    }
  }, [updateDeliveryData, updateDeliveryIsError]);

  useEffect(() => {
    if (isReset) {
      setState(initialState);
    }
  }, [isReset]);

  useEffect(() => {
    if (isActive) {
      refetch();
    }
  }, [isActive]);
  return (
    <Container style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <>
          <CounterButton
            title="Number of Trays sent"
            placeholder="0"
            value={state.number_of_trays_sent ?? ''}
            disabled={!state.number_of_trays_sent}
            error={''}
            onChange={(opr, val): void =>
              handleOnChange(opr, 'number_of_trays_sent', val)
            }
          />

          <CounterButton
            title="Number of Green Basket"
            placeholder="0"
            value={state.number_of_green_basket ?? ''}
            disabled={!state.number_of_green_basket}
            error={''}
            onChange={(opr, val): void =>
              handleOnChange(opr, 'number_of_green_basket', val)
            }
          />

          <CounterButton
            title="Number of Trays Received"
            placeholder="0"
            value={state.number_of_trays_received ?? ''}
            disabled={!state.number_of_trays_received}
            error={''}
            onChange={(opr, val): void =>
              handleOnChange(opr, 'number_of_trays_received', val)
            }
          />

          <View>
            <Text style={styles.notesTitle}>Notes</Text>

            <TextInput
              style={styles.notesTextInput}
              textAlignVertical="top"
              numberOfLines={5}
              onChangeText={handleOnChangeNote}
              value={state.notes}
            />
          </View>
          <View style={{ height: hp('10%') }} />
        </>
      </ScrollView>

      <PrimaryButton onSubmit={handleOnPressSubmit} title="Submit" />
    </Container>
  );
};

export default DeliveryStep2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  notesTextInput: {
    marginHorizontal: 0,
    borderWidth: 0.5,
    paddingHorizontal: 0,
    borderColor: 'gray',
    borderRadius: 5,
    padding: 10,
    paddingLeft: 10,
  },
  notesTitle: {
    paddingVertical: hp(1),
    color: 'gray',
  },
});
