import { View, Text, Modal, Pressable } from 'react-native';

// This component is just for the resolve record popup
const CustomModal = ({ visible, onConfirm, onCancel, message }) => (
	<Modal visible={visible} transparent>
		<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
			<View style={{ width: '80%', backgroundColor: "white", borderRadius: 10, padding: 20, alignItems: "center", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 3.84, elevation: 5 }}>
				<Text style={{ marginBottom: 20 }}>{message}</Text>
				<Pressable onPress={onConfirm} style={{ marginBottom: 10, backgroundColor: 'blue', padding: 10, borderRadius: 5, width: '80%', alignItems: 'center' }}>
					<Text style={{ color: 'white', fontSize: 16 }}>Confirm</Text>
				</Pressable>
				<Pressable onPress={onCancel} style={{ backgroundColor: 'gray', padding: 10, borderRadius: 5, width: '80%', alignItems: 'center' }}>
					<Text style={{ color: 'white', fontSize: 16 }}>Cancel</Text>
				</Pressable>
			</View>
		</View>
	</Modal>
);


export default CustomModal;