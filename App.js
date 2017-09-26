import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  FlatList,
  ScrollView,
  TouchableOpacity,
  PixelRatio,
  Platform,
  AppRegistry
} from 'react-native';
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';
import {BlurView} from 'react-native-blur';
import {KeyboardAccessoryView} from 'react-native-keyboard-input';

const IsIOS = Platform.OS === 'ios';
const TrackInteractive = true;


export default class AwesomeProject extends Component
 {	
	//Static helper functions	
	static  deepCopy(buttonList)
	{
	  var buttonListCopy = [];
	  for(var i=0;i<buttonList.length;i++)
	  {
		  var tempObj = {key: buttonList[i].key, name: buttonList[i].name, text: buttonList[i].text};
		  buttonListCopy.push(tempObj);
	  }
	  return buttonListCopy;
	}
	
	//Non-static functions
    constructor(props) 
	{
		super(props);
		this.state = 
		{
		  menuText: 'Show',
		  showMessages: false,
		  showEdit: false,
		  genKey: 4,
		  message: "",
		  buttonList: 	  
		  [
			  {
				key: 1,        
				name: 'Greeting',
				text: "Hi there, I'm here to chat if you have any questions." ,	
			  },	
			  
			  {
				key: 2,
				name: 'Bye',
				text: "Thank you for dropping by." ,
			  },
			  {
				key: 3,
				name: 'Getting Leads',
				text: "We have 30% sale this week, leave me your email and I'll get back to you with the details." ,
			  },
			  {
				key: 0,
				name: 'Edit',
				text: "",
			  }
		  ],
		  backupButtonList: undefined,		  
		};
		this.keyboardAccessoryViewContent = this.keyboardAccessoryViewContent.bind(this);

    }
  
	getToolbarButtons()
	{
	return this.state.buttonList;
	}	
   
	
	keyboardAccessoryViewContent()
	{
		const InnerContainerComponent = (IsIOS && BlurView) ? BlurView : View;
		return (
		  <InnerContainerComponent blurType="xlight" style={styles.blurContainer}>
			<View style={{borderTopWidth: StyleSheet.hairlineWidth, borderColor: '#bbb'}}/>
			<View style={styles.inputContainer}>
			{/*Message placeholder*/}		
			  <AutoGrowingTextInput
				maxHeight={200}
				style={styles.textInput}
				ref={(r) => {
				  this.textInputRef = r;
				}}
				placeholder={'Message'}
				underlineColorAndroid="transparent"
			  />
			  {/*Action button-show/hide buttons menu*/}
			  <TouchableOpacity style={styles.showButton} onPress={() => this.setState(previousState => 
			  {	return { showMessages: !previousState.showMessages, menuText: previousState.menuText=='Show'? 'Hide':'Show' };  })}>
					<Text>{this.state.menuText}</Text>
			  </TouchableOpacity>
			</View>
			<ScrollView style={styles.buttonsMenu}>
			  {
				//show/hide buttons menu
				this.state.showMessages ? 
				this.getToolbarButtons().map((button, index) => button.key==0 ?
				  <TouchableOpacity onPress={() => this.setState({showEdit:true})} 
				  style={[styles.genericButtonStyle,styles.editStyle]} key={index}>
					<Text style={{textAlign:'center'}}>{button.name}</Text>
				  </TouchableOpacity>:
				  <TouchableOpacity onPress={() => this.setState({ message: button.text })} 
				  style={[styles.genericButtonStyle,styles.buttonStyle]} key={index}>
					<Text style={{textAlign:'center'}}>{button.name}</Text>
				  </TouchableOpacity> )
				  :null
			  }
			</ScrollView>
		  </InnerContainerComponent>
		);
	}
  
  /*Button helper functions
  **************************************************************************** */
  deleteButton(item)
  {
	for(var i=0;i<this.state.buttonList.length;i++)
	  if(this.state.buttonList[i].key==item.key)
		  break;
	this.state.buttonList.splice(i,1);
	this.setState(this.state);
  }
  
  addButton()
  {
	  this.setState(previousState =>
	  { 
	  this.state.buttonList.splice
	  (this.state.buttonList.length-1,0,{key:this.state.genKey, name:'New Button', text:""});
	  this.state.genKey++;
	  return this.state;			  
	  })
  }
  
  findButton(item)
  {
	for(var i=0;i<this.state.buttonList.length;i++)
		if(this.state.buttonList[i].key==item.key)
			return i;
  }
  
  changeButtonName(text,item)
  {
	  var i = this.findButton(item);
	  this.state.buttonList[i].name = text;
  }
  
  changeButtonText(text,item)
  {
	  var i = this.findButton(item);
	  this.state.buttonList[i].text = text;
  }
   
  	
  render() 
  {
	
    return (this.state.showEdit ?
		//Edit Screen
		//**************************************************************************************************
		<ScrollView style={styles.container}>
		
		  {/*List of registered buttons*/} 	
		  <FlatList
          data={this.state.buttonList}
		  extraData={this.state}
          renderItem={({item}) => item.key==0?
		  null:
		  <View>
			  <View style={styles.editView} key={item.key}>
				  <TouchableOpacity onPress = {() => this.deleteButton(item)}		  
				  style={styles.deleteStyle}>
					<Text style={{textAlign:'center'}}>Delete</Text>
			      </TouchableOpacity> 		  	
				  <TextInput style={styles.textInputStyle} onChangeText = 
				  {(text) => {this.setState(previousState => {this.changeButtonName(text,item) })}}		  
				  defaultValue={item.name} />
				  <Text> Name: </Text>				  
				</View>
			  <View style={styles.editView}>		  	
				  <TextInput style={styles.textInputStyle} onChangeText = {(text) =>
				  { this.setState(previousState => {this.changeButtonText(text,item) })}} 
				  multiline= {true} numberOfLines = {4} defaultValue={item.text} />
				  <Text> Text: </Text>				  
			  </View>	
		  </View>  }  />
		  
		  {/*Action buttons*/}
		  <View style={styles.actionButtonsContainer}>
			  <TouchableOpacity onPress = {() => this.addButton()}
			 style={[styles.genericButtonStyle,styles.addStyle]}>
					<Text style={{textAlign:'center'}}>Add</Text>
			  </TouchableOpacity>
			  <TouchableOpacity onPress = {() => this.setState({showEdit: false, showMessages:false,menuText:'Show',
			  message:"", buttonList:AwesomeProject.deepCopy(this.state.backupButtonList)})}  
			  style={[styles.genericButtonStyle,styles.cancelStyle]}>
					<Text style={{textAlign:'center'}}>Cancel</Text>
			  </TouchableOpacity>
			  <TouchableOpacity onPress = {() => this.setState({backupButtonList:AwesomeProject.deepCopy(this.state.buttonList),
				showEdit: false,showMessages: false,menuText:'Show', message: ""})}	  
				style={[styles.genericButtonStyle,styles.saveStyle]}>
					<Text style={{textAlign:'center', color:'white'}}>Save</Text>
			  </TouchableOpacity>
		   </View>

		</ScrollView>
		
		//Main Screen
		//****************************************************************************************************
      : <View style={styles.container}>
			<ScrollView
			 keyboardDismissMode={TrackInteractive ? 'interactive' : 'none'} >			
				  <Text style={styles.welcome}>{this.state.message}</Text>				  
			</ScrollView>

			<KeyboardAccessoryView
			  renderContent={this.keyboardAccessoryViewContent}
			  onHeightChanged={IsIOS ? height => this.setState({keyboardAccessoryViewHeight: height}) : undefined}
			  trackInteractive={TrackInteractive}
			  kbInputRef={this.textInputRef}			  
			  revealKeyboardInteractive
			/>
      </View>
    );
  }
}


//Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF',
  },
  buttonsMenu: {
	  maxHeight:200,
	  paddingLeft:125,
	  paddingRight:125
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    paddingTop: 50,
    paddingBottom: 50,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  blurContainer: {
    ...Platform.select({
      ios: {
        flex: 1,
      },
    }),
  },
  actionButtonsContainer:{
	  paddingTop:25,
	  paddingLeft:100,
	  paddingRight:100
  },
  textInput: {
    flex: 1,
    marginLeft: 10,
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 10,
    paddingTop: 2,
    paddingBottom: 5,
    fontSize: 16,
    backgroundColor: 'white',
    borderWidth: 0.5 / PixelRatio.get(),
    borderRadius: 18,
  },
  showButton: {
    paddingRight: 10,
    paddingLeft: 10,
	marginLeft: 5,
	marginRight: 5,	
	backgroundColor: 'aquamarine',
	borderWidth: 1
  },
  genericButtonStyle: {
	  paddingBottom: 5,
	  marginBottom: 5,
	  borderWidth: 1
  },
  buttonStyle: {
	  backgroundColor: 'bisque'
  },
  editStyle: {
	  backgroundColor:'lightskyblue',
	},
  deleteStyle: {
	  marginRight: 5,
	  marginLeft: 5,
	  backgroundColor: 'grey',
	  borderWidth: 1
	},
  	
  addStyle: {
  backgroundColor:'palegreen'
  },
  cancelStyle: {
	  backgroundColor:'lightcoral'
  },
  saveStyle: {
	  backgroundColor:'royalblue'
  },
  editView: {
	  flexDirection: 'row',
	  paddingTop: 25,
	  paddingBottom: 5,
	  paddingRight: 5,
	  paddingLeft: 5
  },
  textInputStyle: {
	  flex:1,
	  borderColor: 'black',
	  borderWidth: 1
  }
});

AppRegistry.registerComponent('AwesomeProject', () => AwesomeProject);
