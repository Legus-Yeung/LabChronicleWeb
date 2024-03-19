import { View, Text } from 'react-native';

const ModalHeader = ({ title }) => (
    <View style={{
      backgroundColor: 'rgb(0,112,60)', 
      alignItems: 'center',
      justifyContent: 'center', 
      height: 60, 
    }}>
      <Text style={{
        color: '#FFFFFF',
        fontWeight: 'bold', 
        fontSize: 20, 
      }}>
        {title}
      </Text>
    </View>
  );
  
export default ModalHeader;