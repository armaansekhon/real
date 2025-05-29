import { View,Alert, Text, SafeAreaView, StyleSheet, Image, Dimensions, Platform, TouchableOpacity } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../../context/UserContext';
import Malelogo from "../../../assets/svg/loguser.svg";
import { LinearGradient } from 'expo-linear-gradient';
import useLogin from '../../../hooks/useLogin';
import { useRouter } from 'expo-router';
import { useNavigation } from 'expo-router';

const { width } = Dimensions.get("screen");
const Router=useRouter();

const Profile = () => {
    const navigation = useNavigation();
  const { user, img } = useUser() || {};
  const {logout,loading}=useLogin();
  console.log(user)

 const renderProfileImage = () => {
  if (user.userCategoryCode === '0') {
    if (user.gender === 'Female') {
      return <Femalelogo height={80} width={80} />;
    } else {
      return <Malelogo height={80} width={80} />;
    }
  } else if (!img) {
    if (user.gender === 'Female') {
      return  <Image
        source={require("../../../assets/images/woman.png")}
        style={Styles.img2}
      />;
    } else {
      return <Malelogo height={80} width={80} />;
    }
  } else {
    return (
      <Image
        source={{ uri: `data:image/jpeg;base64,${img}` }}
        style={Styles.img}
      />
    );
  }
};

const handleLogout=()=>{
  Alert.alert(
    "Confirm Logout",
    "Are you sure to Logout?",
    [
      {
        text:"cancel", style:"cancel"
      },
      {
        text:"Log-Out", style:"destructive",
        onPress:async()=>{
          await logout();
          Router.replace("(auth)/Login")

        },

      },
    ],
    {cancelable:true}

  );



}

  return (
    <SafeAreaView style={Styles.container}>
      {/* Header */}
      <View style={Styles.header}>
              <TouchableOpacity onPress={() => navigation.openDrawer()}>
                <Ionicons name="menu" size={26} color="black" />
              </TouchableOpacity>
        
        <Text style={Styles.title}>User  <Text style={{color:"#5aaf57"}}>Profile</Text> </Text>
      </View>

      {/* Profile Card with Image */}
      <View style={Styles.cardWrapper}>
        <View style={Styles.profileImageContainer}>
          {renderProfileImage()}
        </View>

        <LinearGradient
  colors={['#5AAF57', '#8DDC85']}
  start={{ x: 0, y: 0 }}
  end={{ x: 1, y: 3 }}
  style={Styles.card}
>
          <View style={Styles.infoSection}>
            <Text style={Styles.name}>{user.name}</Text>
            <Text style={Styles.info}>
              {user.userCategoryCode === "0" ? 'Admin' : user.designation?.name}
            </Text>
            <Text style={Styles.info}>
              {user.userCategoryCode === "0" ? "Land Twisters Pvt .Ltd" : user.designation?.department?.department}
            </Text>
          </View>
        </LinearGradient>
      </View>

      <Text style={Styles.divcont}>
      
      </Text>
      <Text style={Styles.set} >

        <Ionicons ></Ionicons>
        
        Settings</Text>

      {/* Menu */}
      <View style={Styles.menuWrapper}>
        <TouchableOpacity style={Styles.menuButton}>
          <Ionicons name="lock-closed-outline" size={20} color="#333" />
          <Text style={Styles.menuText}>Change Password</Text>
          <Ionicons name="chevron-forward" style={Styles.chevy} size={20} color="#333" />
        </TouchableOpacity>

        <TouchableOpacity 

        onPress={handleLogout}
        disabled={loading}
        
        style={Styles.menuButton}>
         
         

          <Ionicons name="log-out-outline" size={20} color="#333" />
          <Text style={Styles.menuText}>{loading ?"Logging out..." : "Logout"}</Text>
           <Ionicons name="chevron-forward" style={Styles.chevy} size={20} color="#333" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  header: {
    flexDirection: 'column',
    paddingHorizontal: 20,
    paddingTop: 20,
    marginBottom: 20,
    marginTop: 30,
  },
  title: {
    marginTop: 15,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'PlusSB',
  },
  divcont:{
    height:1,
    backgroundColor:"#ccc",
    width:width*0.8,
    marginVertical:10,
    bottom:10,
    alignSelf:"center"

  
    
  },
  cardWrapper: {
    alignItems: 'center',
    marginBottom: 20,
    marginTop: -20,

  },
  card: {
    width: width * 0.83,
    height: 100,
    borderRadius: 12,
    paddingLeft: 50,
  
    justifyContent: 'center',
    marginTop: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#5aaf57",
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 3 },
        shadowRadius: 5,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  profileImageContainer: {
    position: 'absolute',
    left: 5,
    top: 15,
    backgroundColor: 'white',
    borderRadius: 60,
    padding: 15,
    zIndex: 10,
    
    
  },
  set:{
    padding:10,
    paddingLeft:30,
    fontSize:20,
    fontFamily:"PlusSB",
    color:"#5aaf57"

  },
  img: {
    height: 80,
    width: 80 ,
    borderRadius: 70,
  },
   img2: {
    height: 80,
    width: 70 ,
    borderRadius: 80,
  },
  infoSection: {

    alignSelf:"center",
    marginRight: -40,
  },
  name: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: "PlusSB",
  },
  info: {
    color: 'white',
    fontSize: 12,
    fontFamily: "PlusSB",
  },
  chevy:{

    marginLeft:"auto"
   



  },
  menuWrapper: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    borderRadius: 12,
    paddingVertical: 5,
    ...Platform.select({
      ios: {
        shadowColor: "#5aaf57",
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 4 },
        shadowRadius: 6,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderBottomColor: '#ddd',
    // borderBottomWidth: 1,
  },
  menuText: {
    fontSize: 16,
    fontFamily: "PlusR",
    color: '#333',
    marginLeft: 15,
  },
});
