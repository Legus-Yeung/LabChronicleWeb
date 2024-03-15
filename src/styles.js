import { StyleSheet } from 'react-native';

//eventually update the styling numbers to be flexible so they look good on any device
const style = StyleSheet.create({
  //gives a basic container, changes background to white and gives a bit of wiggle room on the sides
  analyticsContainer: {
    backgroundColor: '#FFFFFF'
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    flexDirection: 'column',
  },
  createContainer: {
    backgroundColor: '#fff',
    flexDirection: 'column',
    flex: 1,
  },
  deleteIcon: {
    flex: 1,
    marginLeft: 10,
    paddingTop: 4
  },
  editButton: {
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 2,
  },
  editText: {
    color: 'rgb(0,187,211)',
    fontSize: 16,
  },
  genericButton: {
    backgroundColor: '#000000',
    justifyContent: 'center',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 2
  },
  genericButtonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold'
  },
  headerContainerDashboard: {
    flexDirection: 'column',
  },
  headerTextStyle: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  input: {
    //button block
    flex: 5,
    height: 40,
    justifyContent: 'center',
    borderColor: 'black',
    borderWidth: 1,
    marginBottom: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  inputText: {
    fontSize: 16,
    letterSpacing: 0.25,
    color: 'black',
  },
  listBorderLeft: {
    borderLeftWidth: 1,
    borderColor: 'grey',
    justifyContent: 'center',
    marginHorizontal: 10,
    marginBottom: 5,
  },
  loginButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 4,
    backgroundColor: 'black',
    borderWidth: 1,
  },
  loginText: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
  },
  notesInput: {
    //button block
    height: 40,
    justifyContent: 'center',
    borderColor: 'black',
    borderBottomWidth: 1,
    marginTop: 10,
    marginBottom: 15,
    marginHorizontal: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  recordButton: {
    borderColor: '#000000',
    borderRadius: 4,
    marginHorizontal: 10,
    backgroundColor: '#FFFFFF',
  },
  recordContainer: {
    flex: 3,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  resolvedContainer: {
    justifyContent:'space-between',
    flexDirection: 'row',
    marginBottom: 10 ,
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 1,
    padding: 10
  },
  signupButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgb(200,200,200)',
    padding: 10,
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 2
  },
  signupText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  subheaderTextStyle: {
    fontSize: 18,
    fontWeight: 'bold',
    paddingLeft: 5,
  },
  subsubheaderTextStyle: {
    fontSize: 15,
    fontWeight: 'bold',
    paddingLeft: 5,
    marginTop: 10,
  },
  textStyle: {
    fontSize: 18,
    marginTop: 12,
    marginBottom: 12,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default style;