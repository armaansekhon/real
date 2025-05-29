import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Animated,
  ScrollView,
  Dimensions,
  Platform,
  StatusBar,
  TouchableOpacity,
  SafeAreaView,

} from 'react-native';
import { Ionicons, Feather } from '@expo/vector-icons'; // Icons!
import LottieView from 'lottie-react-native';
import AdminStatsSection from './AdminStatSection';
import AdminAppointments from './AdminAppointments';
import { useNavigation } from 'expo-router';


const { height, width } = Dimensions.get('window');
const HEADER_MAX_HEIGHT = height * 0.27;
const HEADER_MIN_HEIGHT = height * 0.13;
const CARD_HEIGHT = height * 0.12;





const AdminDashboard = () => {
  const navigation = useNavigation();

  

  
  
  const scrollY = React.useRef(new Animated.Value(0)).current;

  const headerHeight = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [HEADER_MAX_HEIGHT, HEADER_MIN_HEIGHT],
    extrapolate: 'clamp',
  });

  const cardOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT - 25],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  const cardTranslate = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [0, -30],
    extrapolate: 'clamp',
  });
  const welcomeFontSize = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [36, 20],
    extrapolate: 'clamp',
  });

  const welcomeTranslateX = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [0, -width / 3 + 40], // shift to left
    extrapolate: 'clamp',
  });

  const welcomeTranslateY = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT],
    outputRange: [0, -10], // reduced from -HEADER_MAX_HEIGHT / 2 + 50
    extrapolate: 'clamp',
  });

  const userIconOpacity = scrollY.interpolate({
    inputRange: [0, HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT - 10],
    outputRange: [0, 1],
    extrapolate: 'clamp',
  });

  

  return (
    <View style={styles.container}>
            <StatusBar
              barStyle="dark-content"
              backgroundColor="transparent"
              translucent
            />
      {/* <StatusBar barStyle="light-content" backgroundColor="#00C897" translucent /> */}
      < LottieView
         source={require('../assets/svg/header.json')}
         autoPlay={true}
         loop={true}
         speed={0.5}
         style={styles.ani}
       />
       <Animated.View
  style={[
    styles.centerTextContainer,
    {
      transform: [
        { translateX: welcomeTranslateX },
        { translateY: welcomeTranslateY },
      ],
    },
  ]}
>
  <Animated.Text style={[styles.bigWelcome, { fontSize: welcomeFontSize }]}>
  <Animated.View style={{  opacity: userIconOpacity,}}>
   <LottieView
     source={require('../assets/svg/reales.json')}
     autoPlay={true}
     loop={true}
     speed={0.5}
     style={styles.ani2}
   />
  </Animated.View>
    Welcome <Text style={{ color:  '#5aaf57', fontFamily: 'PlusR', }}>Admin</Text>
  </Animated.Text>
</Animated.View>

      {/* Animated Header */}
      <Animated.View style={[styles.header, { height: headerHeight }]}>
        {/* Top Row: Icons */}
      
        <View style={styles.headerTopRow}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
  <Ionicons name="menu" size={26} color="#000" />
</TouchableOpacity>
          <TouchableOpacity>
            <Feather name="user" size={24} color="#000" />
          </TouchableOpacity>
          
        </View>

        {/* Center Title */}
       
        {/* Small admin name when header shrinks */}
        
       
      </Animated.View>
      

      {/* Animated Card */}
      <Animated.View
        style={[
          styles.card,
          {
            opacity: cardOpacity,
            transform: [{ translateY: cardTranslate }],
          },
        ]}
      >
        <Image
          source={{ uri: 'https://i.pravatar.cc/150?img=12' }}
          style={styles.avatar}
        />
        <View style={styles.cardContent}>
          <Text style={styles.name}>Pisoft</Text>
          <Text style={styles.designation}>Senior Developer</Text>
          {/* <Text style={styles.details}>ID: EMP12345</Text> */}
        </View>
      </Animated.View>

      {/* Scroll Content */}
      <Animated.ScrollView
        contentContainerStyle={styles.scrollContent}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
      >
        <View style={{ height: 800, padding: 20 }}>
         <AdminStatsSection></AdminStatsSection>
         <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
   <AdminAppointments></AdminAppointments>
    </SafeAreaView>

        </View>
      </Animated.ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    position: 'absolute',
    top: 0,
    width: '100%',
    backgroundColor: 'transparent',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 15 : 60,
    paddingBottom: 20,
    zIndex: 10,
    elevation: 5,
    
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 35
  },
  centerTextContainer: {
    marginTop: Platform.OS === 'ios' ? HEADER_MIN_HEIGHT-10 : HEADER_MIN_HEIGHT-40 ,
  alignItems: 'center',
  // position: 'absolute',
  width: '100%',
  zIndex: 15,
  },
  bigWelcome: {
   
    color: '#000',
    fontSize: 36,
    // fontWeight: '700',
    fontFamily:"PlusR",
    marginTop: 23,
  },
 
  card: {
    position: 'absolute',
    top: Platform.OS === 'ios' ?  HEADER_MAX_HEIGHT - CARD_HEIGHT / 1.2 : HEADER_MAX_HEIGHT - CARD_HEIGHT / 1,
    alignSelf: 'center',
    width: width * 0.75,
    height: CARD_HEIGHT,
    // borderBottomWidth:0.5,
    backgroundColor: 'transparent',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent:"center",
    padding: 11,
    zIndex: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#5aaf57',
        shadowOpacity: 0.3,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
      // android: {
      //   elevation: 6,
      // },
    }),
  },
  avatar: {
    width: 65,
    height: 65,
    marginTop: 30,
    borderRadius: 40,
    
    // borderColor: '#00AC88',
    // borderWidth: 2,
    resizeMode: 'cover',
  },
  cardContent: {
    marginTop: 20,
    marginLeft:30,
    flexShrink: 1,
  },
  ani: {
    ...StyleSheet.absoluteFillObject,
    // marginRight: 10,
    height:200,
    width:200
,
transform:[{scale:4.5}],


},
// ani2: {
//   marginRight: 30,
//   height:50,
//   width:50
// ,paddingLeft:20,
// transform:[{scale:2.5}],
// // marginBottom:2,




//   },
  name: {
    fontSize: 25,
    // fontWeight: '600',
    color: '#000',
    fontFamily:"PlusR"
  },
  designation: {
    fontSize: 14,
    color: '#196f3d',
    marginVertical: 2,
  },
  details: {
    fontSize: 13,
    color: '#196f3d',
  },
  scrollContent: {
    paddingTop: Platform.OS === 'ios' ? HEADER_MAX_HEIGHT -160 : HEADER_MAX_HEIGHT - 120 ,
    // paddingBottom: 40,
    // borderWidth:1,
    
  },
});

export default AdminDashboard;
