import React from 'react';
import { Platform } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { height, Icon, width, w, h } from '../../utils/api/helpers';
import Login from '../authorization/Login';
import SignUp from '../authorization/SignUp';
import EmailVerification from '../authorization/EmailVerification';
import AuthLoadingScreen from '../common/AuthLoadingScreen';
import DrawerMenuBar from '../common/DrawerMenuBar';
import HomePage from '../common/HomePage';
import ReferAFriendPage from '../common/ReferAFriendPage';
import SchedulePage from '../common/SchedulePage';
import DietPlanDetailsScreen from '../diet/DietPlanDetailsScreen';
import DietPlanScreen from '../diet/DietPlanScreen';
import Workouts from '../workout/Workouts';
import WorkoutDetails from '../workout/WorkoutDetails';
// import MyTrainerTab from '../memberTrainer/MyTrainerTab'
import PackageDetails from '../packages/PackageDetails'
import RenewPackage from '../packages/RenewPackage'
import PackageHome from '../packages/PackageHome'
// import InitialHomePage from '../packages/InitialHomePage'
import TrainerQuestionOne from '../packages/TrainerQuestionOne'
import TrainerQuestionTwo from '../packages/TrainerQuestionTwo'
import TrainerQuestionThree from '../packages/TrainerQuestionThree'
// import TrainerHome from '../trainer/TrainerHome'
import Reward from '../trainer/Reward'
import TrainerDrawerMenuBar from '../trainer/TrainerDrawerMenuBar'
// import AssignWorkoutNavigator from '../trainer/AssignWorkoutNavigator'
// import RewardMember from '../reward/RewardMember'
// import AssignDietNavigator from '../trainer/AssignDietNavigator'
import PaymentPackage from '../packages/PaymentPackage'
import Invoice from '../menuComponents/Invoice'
import Settings from '../menuComponents/Settings'
import EditProfile from '../menuComponents/EditProfile'
import Language from '../menuComponents/Language'
import ChangePassword from '../menuComponents/ChangePassword'
import TrainerPackage from '../trainer/TrainerPackage'
import MenuItems from '../webShop/MenuItems'
import ItemDetails from '../webShop/ItemDetails'
import Cart from '../webShop/Cart'
import Orders from '../webShop/Orders'
import OrderDetails from '../webShop/OrderDetails'
import Payment from '../webShop/Payment'
import PaymentIfQuestion from '../packages/PaymentIfQuestion'
import Maps from '../maps/Maps'
import ContactHome from '../maps/ContactHome'
import BMI from '../bmi/BMI'
import WaterIntake from '../waterIntake/WaterIntake'
import AddWater from '../waterIntake/AddWater'
import Reminder from '../waterIntake/Reminder'
import ClassHome from '../classes/ClassHome'
import ClassDetailsBeforeBuy from '../classes/ClassDetailsBeforeBuy'
import ClassDetailsAfterBuy from '../classes/ClassDetailsAfterBuy'
import PaymentClass from '../classes/PaymentClass'
import Feedback from '../feedback/Feedback'
import Announcement from '../announcement/Announcement'
import AnnouncementDetails from '../announcement/AnnouncementDetails'
import MyMembers from '../trainer/mymembers/MyMembers'
import MyMemberDetails from '../trainer/mymembers/MyMemberDetails'
import AddMemberWorkout from '../trainer/mymembers/AddMemberWorkout'
import UpdateMemberWorkout from '../trainer/mymembers/UpdateMemberWorkout'
import AddMemberDiet from '../trainer/mymembers/AddMemberDiet'
import MemberDietDetails from '../trainer/mymembers/MemberDietDetails'
import UpdateMemberDiet from '../trainer/mymembers/UpdateMemberDiet'
import MyClasses from '../trainer/myClasses/MyClasses'
import MyClassesDetails from '../trainer/myClasses/MyClassesDetails'
import MemberAttendance from '../memberAttendance/MemberAttendance'
import Notifications from '../menuComponents/Notifications'
import AdminDrawerMenuBar from '../admin/AdminDrawerMenuBar'
// import AdminHomePage from '../admin/AdminHomePage'
import AdminBranchSales from '../admin/AdminBranchSales'
import AdminMemberAttendance from '../admin/AdminMemberAttendance'
import AdminPackageDetails from '../admin/AdminPackageDetails'
import AdminRevenueDetails from '../admin/AdminRevenueDetails'
import AdminMostSellingProduct from '../admin/AdminMostSellingProduct'
// import BookAppointmentNavigator from '../bookAppointments/BookAppointmentNavigator'
import QuestionOne from '../memberQuestions/QuestionOne'
import QuestionTwo from '../memberQuestions/QuestionTwo'
import QuestionThree from '../memberQuestions/QuestionThree'
import About from '../common/About'
import AdminFeedback from '../admin/feedback/AdminFeedback'
import AdminFeedbackDetails from '../admin/feedback/AdminFeedbackDetails'
import AdminAddFeedback from '../admin/feedback/AdminAddFeedback'
import i18n from 'i18n-js'


const memberTabAfterFingerAuth = createBottomTabNavigator();
const memberStackAfterFingerAuth = createStackNavigator();
const memberDrawerAfterFingerAuthEnglish = createDrawerNavigator();
const memberDrawerAfterFingerAuthArabic = createDrawerNavigator();


export const MemberBottomTabWhenAuth = () => {
    return (
        <memberTabAfterFingerAuth.Navigator screenOptions={({ route }) => ({
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                if (route.name === 'HomePage') {
                    iconName = 'home'
                } else if (route.name === 'BMI') {
                    iconName = 'bmi-tracker'
                } else if (route.name === 'WaterIntake') {
                    iconName = 'water-intake'
                }
                return <Icon name={iconName} size={25} color={color} />;
            },
        })}
            tabBarOptions={{ activeTintColor: '#1976d2' }}>
            <memberTabAfterFingerAuth.Screen name="HomePage" component={HomePage} />
            <memberTabAfterFingerAuth.Screen name="BMI" component={BMI} />
            <memberTabAfterFingerAuth.Screen name="WaterIntake" component={WaterIntake} />
        </memberTabAfterFingerAuth.Navigator>
    )
}

export const MemberStackWhenAuth = () => {
    return (
        <memberStackAfterFingerAuth.Navigator>
            <memberStackAfterFingerAuth.Screen name="MemberBottomTabWhenAuth" component={MemberBottomTabWhenAuth} options={{ headerShown: false }} />
            <memberStackAfterFingerAuth.Screen name="DietPlanDetailsScreen" component={DietPlanDetailsScreen} options={{ headerShown: false }} />
            <memberStackAfterFingerAuth.Screen name="DietPlanScreen" component={DietPlanScreen} options={{ headerShown: false }} />
            <memberStackAfterFingerAuth.Screen name="Workouts" component={Workouts} options={{ headerShown: false }} />
            <memberStackAfterFingerAuth.Screen name="WorkoutDetails" component={WorkoutDetails} options={{ headerShown: false }} />
            {/* <memberStackAfterFingerAuth.Screen name="MyTrainerTab" component={MyTrainerTab} options={{ headerShown: false }} /> */}
            <memberStackAfterFingerAuth.Screen name="SchedulePage" component={SchedulePage} options={{ headerShown: false }} />
            <memberStackAfterFingerAuth.Screen name="RenewPackage" component={RenewPackage} options={{ headerShown: false }} />
            <memberStackAfterFingerAuth.Screen name="PackageDetails" component={PackageDetails} options={{ headerShown: false }} />
            <memberStackAfterFingerAuth.Screen name="TrainerQuestionOne" component={TrainerQuestionOne} options={{ headerShown: false }} />
            <memberStackAfterFingerAuth.Screen name="TrainerQuestionTwo" component={TrainerQuestionTwo} options={{ headerShown: false }} />
            <memberStackAfterFingerAuth.Screen name="TrainerQuestionThree" component={TrainerQuestionThree} options={{ headerShown: false }} />
            <memberStackAfterFingerAuth.Screen name="PaymentPackage" component={PaymentPackage} options={{ headerShown: false }} />
            <memberStackAfterFingerAuth.Screen name="PaymentIfQuestion" component={PaymentIfQuestion} options={{ headerShown: false }} />
            <memberStackAfterFingerAuth.Screen name="Invoice" component={Invoice} options={{ headerShown: false }} />
            <memberStackAfterFingerAuth.Screen name="Settings" component={Settings} options={{ headerShown: false }} />
            <memberStackAfterFingerAuth.Screen name="EditProfile" component={EditProfile} options={{ headerShown: false }} />
            <memberStackAfterFingerAuth.Screen name="Language" component={Language} options={{ headerShown: false }} />
            <memberStackAfterFingerAuth.Screen name="MenuItems" component={MenuItems} options={{ headerShown: false }} />
            <memberStackAfterFingerAuth.Screen name="ItemDetails" component={ItemDetails} options={{ headerShown: false }} />
            <memberStackAfterFingerAuth.Screen name="Cart" component={Cart} options={{ headerShown: false }} />
            <memberStackAfterFingerAuth.Screen name="Orders" component={Orders} options={{ headerShown: false }} />
            <memberStackAfterFingerAuth.Screen name="OrderDetails" component={OrderDetails} options={{ headerShown: false }} />
            <memberStackAfterFingerAuth.Screen name="Payment" component={Payment} options={{ headerShown: false }} />
            <memberStackAfterFingerAuth.Screen name="Maps" component={Maps} options={{ headerShown: false }} />
            <memberStackAfterFingerAuth.Screen name="ContactHome" component={ContactHome} options={{ headerShown: false }} />
            <memberStackAfterFingerAuth.Screen name="ReferAFriendPage" component={ReferAFriendPage} options={{ headerShown: false }} />
            <memberStackAfterFingerAuth.Screen name="AddWater" component={AddWater} options={{ headerShown: false }} />
            <memberStackAfterFingerAuth.Screen name="Reminder" component={Reminder} options={{ headerShown: false }} />
            <memberStackAfterFingerAuth.Screen name="ClassHome" component={ClassHome} options={{ headerShown: false }} />
            <memberStackAfterFingerAuth.Screen name="ClassDetailsBeforeBuy" component={ClassDetailsBeforeBuy} options={{ headerShown: false }} />
            <memberStackAfterFingerAuth.Screen name="ClassDetailsAfterBuy" component={ClassDetailsAfterBuy} options={{ headerShown: false }} />
            <memberStackAfterFingerAuth.Screen name="PaymentClass" component={PaymentClass} options={{ headerShown: false }} />
            <memberStackAfterFingerAuth.Screen name="Feedback" component={Feedback} options={{ headerShown: false }} />
            {/* <memberStackAfterFingerAuth.Screen name="RewardMember" component={RewardMember} options={{ headerShown: false }} /> */}
            <memberStackAfterFingerAuth.Screen name="Announcement" component={Announcement} options={{ headerShown: false }} />
            <memberStackAfterFingerAuth.Screen name="AnnouncementDetails" component={AnnouncementDetails} options={{ headerShown: false }} />
            <memberStackAfterFingerAuth.Screen name="ChangePassword" component={ChangePassword} options={{ headerShown: false }} />
            <memberStackAfterFingerAuth.Screen name="MemberAttendance" component={MemberAttendance} options={{ headerShown: false }} />
            <memberStackAfterFingerAuth.Screen name="Notifications" component={Notifications} options={{ headerShown: false }} />
            {/* <memberStackAfterFingerAuth.Screen name="BookAppointmentNavigator" component={BookAppointmentNavigator} options={{ headerShown: false }} /> */}
            <memberStackAfterFingerAuth.Screen name="QuestionOne" component={QuestionOne} options={{ headerShown: false }} />
            <memberStackAfterFingerAuth.Screen name="QuestionTwo" component={QuestionTwo} options={{ headerShown: false }} />
            <memberStackAfterFingerAuth.Screen name="QuestionThree" component={QuestionThree} options={{ headerShown: false }} />
            <memberStackAfterFingerAuth.Screen name="About" component={About} options={{ headerShown: false }} />
        </memberStackAfterFingerAuth.Navigator>
    )
}

export const MemberDrawerWhenFingerAuthEnglish = () => {
    return (
        <memberDrawerAfterFingerAuthEnglish.Navigator drawerType={'slide'}>
            <memberDrawerAfterFingerAuthEnglish.Screen name="Home" component={MemberStackWhenAuth} />
        </memberDrawerAfterFingerAuthEnglish.Navigator>
    )
}

const AuthStack = createStackNavigator();

export const Auth = () => {
    return (
        <AuthStack.Navigator>
            <AuthStack.Screen name="Login" component={Login} options={{ headerShown: false }} />
            <AuthStack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
            <AuthStack.Screen name="EmailVerification" component={EmailVerification} options={{ headerShown: false }} />
        </AuthStack.Navigator>
    )
}

const AuthLoading = createStackNavigator();

export const Navigator = () => {
    return (
        <NavigationContainer>
            <AuthLoading.Navigator>
                <AuthLoading.Screen name="AuthLoadingScreen" component={AuthLoadingScreen} options={{ headerShown: false }} />
                <AuthLoading.Screen name="Auth" component={Auth} options={{ headerShown: false }} />
                <AuthLoading.Screen name="MemberDrawerWhenFingerAuthEnglish" component={MemberDrawerWhenFingerAuthEnglish} options={{ headerShown: false }} />
            </AuthLoading.Navigator>
        </NavigationContainer>
    )
}