import React, { Component } from 'react';
import {Image,ImageBackground, View, Text, ActivityIndicator,ScrollView,TouchableHighlight, Dimensions, BackHandler, AppRegistry} from 'react-native';
    
  var keys = (() => {
	  var i  = 0
	  return (() => ++i);
  })();	
	
	
export default class App extends Component {
	constructor(props){
		super(props)
		this.state = {state:0, data:'',pic:'',dim:{height:Dimensions.get('window').height,width:Dimensions.get('window').width}} //0-load, 1-grid, 2-slideimage, 3-observeimage		
	}
	
	onPressIcon(elem){
		let prevSt = this.state;
		prevSt.pic = elem;
		prevSt.state = 2;
		this.setState(prevSt);
	}
	
	onPressImage(){
		let prevSt = this.state;
		prevSt.state = 3;
		this.setState(prevSt);
	}	
	
	onPressImage2(){
		let prevSt = this.state;
		prevSt.state = 2;
		this.setState(prevSt);
	}	
	
	onPressPrev(){
		let prevSt = this.state;
		if (this.state.pic.index > 1){
			prevSt.pic = this.state.data[this.state.pic.index - 2];
			this.setState(prevSt);
		}
	}	


	onPressNext(){
		let prevSt = this.state;
		if (this.state.pic.index < this.state.data.length){
			prevSt.pic = this.state.data[this.state.pic.index];
			this.setState(prevSt);
		}
	}
	componentWillMount() {
			Dimensions.addEventListener('change', (d)=>{return this.setState({state:this.state.state,data:this.state.data,dim:{height:d.window.height,width:d.window.width}})});
			BackHandler.addEventListener('hardwareBackPress', () => {
				let prevSt = this.state;
				if (prevSt.state == 1) return false;
				--prevSt.state;
				this.setState(prevSt);
				return true;})
		
	}
	componentWillUnmount() {
			Dimensions.removeEventListener('change', (d)=>{return this.setState({state:this.state.state,data:this.state.data,dim:{height:d.window.height,width:d.window.width}})});
			BackHandler.RemoveEventListener('hardwareBackPress', () => {
				let prevSt = this.state;
				if (prevSt.state == 1) return false;
				--prevSt.state;
				this.setState(prevSt);
				return true;})	
	}
	
  componentDidMount() {
    return fetch('https://s3.amazonaws.com/vgv-public/tests/astro-native/task.json')
      .then((response) => response.json())
      .then((responseJson) => {
		let i = 0;
		let wideAr = responseJson.map((elem)=>{++i; elem.index = i; return elem});
        this.setState({
          state: 1,
          data:wideAr,
		  dim:this.state.dim
        });
      })
      .catch((error) => {
      });
  }
	
  render() {
	  
	switch (this.state.state){  
	case 0:
		return ( 
	<View style={{flex: 1,justifyContent:'space-around'}}>
	  <ActivityIndicator />
	</View>
		); 
	case 1:
    return (
		<ScrollView pagingEnabled = {true} contentContainerStyle ={{flexDirection:'row',flexWrap:'wrap'}} onPress = {this.onPress}>
		{this.state.data.map((elem) => {return (
			<View key = {keys()} style = {{height:this.state.dim.height/2,width:this.state.dim.width/2}}>
			<TouchableHighlight key = {keys()} onPress={()=>{return this.onPressIcon(elem)}} underlayColor="white">
				<Image source = {{uri: elem.thumbnailUrl}} style={{height:this.state.dim.height/2-5,width:this.state.dim.width/2-5}} />
			</TouchableHighlight>
			</View>
				)})}
		</ScrollView>);
	case 2:
	return (
		<TouchableHighlight key = {keys()} onPress={()=>{return this.onPressImage()}} underlayColor="white">
			<Image source = {{uri: this.state.pic.originalUrl}} style={{height:this.state.dim.height,width:this.state.dim.width}} />
		</TouchableHighlight>				
	)
	case 3:
	return (
			<View>
				<Image source = {{uri: this.state.pic.originalUrl}} style={{height:this.state.dim.height,width:this.state.dim.width}} />
				<View key = {keys()} style = {{position:'absolute',flex:1,flexDirection:'row',height:this.state.dim.height,width:this.state.dim.width}}>
					<TouchableHighlight key = {keys()} onPress={()=>{return this.onPressPrev()}} underlayColor='rgba(0,0,0,0.5)'>
						<View key = {keys()} style ={{height:this.state.dim.height, width:this.state.dim.width/5, backgroundColor:'rgba(100,100,100,0.5)'}}/>
					</TouchableHighlight>
					<TouchableHighlight key = {keys()} onPress={()=>{return this.onPressImage2()}}>
						<View key = {keys()} style ={{flex:1, flexDirection:'column', justifyContent:'space-around', height:this.state.dim.height, width:3*this.state.dim.width/5}}>
							<Text style = {{fontSize:15,color:'white'}}>{this.state.pic.title}</Text>
							<Text style = {{fontSize:10,color:'white'}}>{this.state.pic.description}</Text>
						</View>
					</TouchableHighlight>
					<TouchableHighlight key = {keys()} onPress={()=>{return this.onPressNext()}} underlayColor='rgba(0,0,0,0.5)'>
						<View key = {keys()} style ={{height:this.state.dim.height, width:this.state.dim.width/5, backgroundColor:'rgba(100,100,100,0.5)'}}/>
					</TouchableHighlight>				
				</View>	
			</View>
	)	
	default:return ""
  }
}
}
