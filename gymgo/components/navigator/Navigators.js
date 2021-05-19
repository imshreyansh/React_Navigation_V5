import React from 'react';
import { Platform } from 'react-native'
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
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
import MyTrainerTab from '../memberTrainer/MyTrainerTab'
import PackageDetails from '../packages/PackageDetails'
import RenewPackage from '../packages/RenewPackage'
import PackageHome from '../packages/PackageHome'
import InitialHomePage from '../packages/InitialHomePage'
import TrainerQuestionOne from '../packages/TrainerQuestionOne'
import TrainerQuestionTwo from '../packages/TrainerQuestionTwo'
import TrainerQuestionThree from '../packages/TrainerQuestionThree'
import TrainerHome from '../trainer/TrainerHome'
import Reward from '../trainer/Reward'
import TrainerDrawerMenuBar from '../trainer/TrainerDrawerMenuBar'
import AssignWorkoutNavigator from '../trainer/AssignWorkoutNavigator'
import RewardMember from '../reward/RewardMember'
import AssignDietNavigator from '../trainer/AssignDietNavigator'
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
import AdminHomePage from '../admin/AdminHomePage'
import AdminBranchSales from '../admin/AdminBranchSales'
import AdminMemberAttendance from '../admin/AdminMemberAttendance'
import AdminPackageDetails from '../admin/AdminPackageDetails'
import AdminRevenueDetails from '../admin/AdminRevenueDetails'
import AdminMostSellingProduct from '../admin/AdminMostSellingProduct'
import BookAppointmentNavigator from '../bookAppointments/BookAppointmentNavigator'
import QuestionOne from '../memberQuestions/QuestionOne'
import QuestionTwo from '../memberQuestions/QuestionTwo'
import QuestionThree from '../memberQuestions/QuestionThree'
import About from '../common/About'
import AdminFeedback from '../admin/feedback/AdminFeedback'
import AdminFeedbackDetails from '../admin/feedback/AdminFeedbackDetails'
import AdminAddFeedback from '../admin/feedback/AdminAddFeedback'
import i18n from 'i18n-js'

//MEMBER TAB NAVIGATOR AFTER SUCCESFULL FINGER AUTH
const MainTabNavigator = createBottomTabNavigator({
  HomePage: {
    screen: HomePage,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <Icon name='home' size={25} color={tintColor} />
    },
  },

  BmiTracker: {
    screen: BMI,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <Icon name='bmi-tracker' size={25} color={tintColor} />
    }
  },
  WaterIntake: {
    screen: WaterIntake,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <Icon name='water-intake' size={25} color={tintColor} />
    }
  },

}, {
  tabBarOptions: {

    activeTintColor: '#1976d2',


  }
})

//TRAINER TAB NAVIGATOR
const TrainerMainTabNavigator = createBottomTabNavigator({
  TrainerHome: {
    screen: TrainerHome,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <Icon name='home' size={25} color={tintColor} />
    }
  },
  // Reward: {
  //   screen: Reward,
  //   navigationOptions: {
  //     tabBarIcon: ({ tintColor }) => <Icon name='attendance' size={25} color={tintColor} />
  //   }
  // },
  // ReferAFriendPage: {
  //   screen: ReferAFriendPage,
  //   navigationOptions: {
  //     tabBarIcon: ({ tintColor }) => <Icon name='user' size={25} color={tintColor} />
  //   }
  // }
}, {
  tabBarOptions: {
    activeTintColor: '#1976d2',
    labelStyle: {
      fontSize: width / 28,
    },
    style: {
      height: height / 12,
      padding: height / 120
    }
  }
})

//TRAINER APP STACK NAVIGATOR
const TrainerAppStackNavigator = createStackNavigator({
  TrainerMainTabNavigator: {
    screen: TrainerMainTabNavigator,
    navigationOptions: {
      header: null,
    },
  }, AssignWorkoutNavigator: {
    screen: AssignWorkoutNavigator,
    navigationOptions: {
      header: null,
    },
  }, AssignDietNavigator: {
    screen: AssignDietNavigator,
    navigationOptions: {
      header: null,
    },
  }, Invoice: {
    screen: Invoice,
    navigationOptions: {
      header: null
    },
  },
  TrainerPackage: {
    screen: TrainerPackage,
    navigationOptions: {
      header: null
    },
  }, Settings: {
    screen: Settings,
    navigationOptions: {
      header: null
    },
  }, EditProfile: {
    screen: EditProfile,
    navigationOptions: {
      header: null
    },
  }, Language: {
    screen: Language,
    navigationOptions: {
      header: null
    },
  },
  Maps: {
    screen: Maps,
    navigationOptions: {
      header: null
    },
  },
  ContactHome: {
    screen: ContactHome,
    navigationOptions: {
      header: null
    },
  },
  Announcement: {
    screen: Announcement,
    navigationOptions: {
      header: null
    },
  },
  AnnouncementDetails: {
    screen: AnnouncementDetails,
    navigationOptions: {
      header: null
    },
  },
  SchedulePage: {
    screen: SchedulePage,
    navigationOptions: {
      header: null
    },
  },
  ChangePassword: {
    screen: ChangePassword,
    navigationOptions: {
      header: null
    },
  },
  MyMembers: {
    screen: MyMembers,
    navigationOptions: {
      header: null
    },
  },
  MyMemberDetails: {
    screen: MyMemberDetails,
    navigationOptions: {
      header: null
    },
  },
  AddMemberWorkout: {
    screen: AddMemberWorkout,
    navigationOptions: {
      header: null
    },
  },
  UpdateMemberWorkout: {
    screen: UpdateMemberWorkout,
    navigationOptions: {
      header: null
    },
  },
  AddMemberDiet: {
    screen: AddMemberDiet,
    navigationOptions: {
      header: null
    },
  },
  MemberDietDetails: {
    screen: MemberDietDetails,
    navigationOptions: {
      header: null
    },
  },
  UpdateMemberDiet: {
    screen: UpdateMemberDiet,
    navigationOptions: {
      header: null
    },
  },
  MyClasses: {
    screen: MyClasses,
    navigationOptions: {
      header: null
    },
  },
  MyClassesDetails: {
    screen: MyClassesDetails,
    navigationOptions: {
      header: null
    },
  },
  Notifications: {
    screen: Notifications,
    navigationOptions: {
      header: null
    },
  },
  About: {
    screen: About,
    navigationOptions: {
      header: null
    }
  }
}, {
  defaultNavigationOptions: {
    gesturesEnabled: false,
  }
})

//MEMBER APP STACK NAVIGATOR AFTER SUCCESFULL FINGER AUTH
const AppStackNavigator = createStackNavigator({
  MainTabNavigator: {
    screen: MainTabNavigator,
    navigationOptions: {
      header: null,
    },
  },
  DietPlanDetailsScreen: {
    screen: DietPlanDetailsScreen,
    navigationOptions: {
      header: null
    },
  },
  DietPlanScreen: {
    screen: DietPlanScreen,
    navigationOptions: {
      header: null
    },
  },
  Workouts: {
    screen: Workouts,
    navigationOptions: {
      header: null
    },
  },
  WorkoutDetails: {
    screen: WorkoutDetails,
    navigationOptions: {
      header: null
    },
  },

  MyTrainerTab: {
    screen: MyTrainerTab,
    navigationOptions: {
      header: null
    },
  },
  SchedulePage: {
    screen: SchedulePage,
    navigationOptions: {
      header: null
    },
  }, RenewPackage: {
    screen: RenewPackage,
    navigationOptions: {
      header: null
    },
  },
  PackageDetails: {
    screen: PackageDetails,
    navigationOptions: {
      header: null
    },
  },
  TrainerQuestionOne: {
    screen: TrainerQuestionOne,
    navigationOptions: {
      header: null
    },
  },
  TrainerQuestionTwo: {
    screen: TrainerQuestionTwo,
    navigationOptions: {
      header: null
    },
  },
  TrainerQuestionThree: {
    screen: TrainerQuestionThree,
    navigationOptions: {
      header: null
    },
  },
  PaymentPackage: {
    screen: PaymentPackage,
    navigationOptions: {
      header: null
    },
  },
  PaymentIfQuestion: {
    screen: PaymentIfQuestion,
    navigationOptions: {
      header: null
    },
  },
  Invoice: {
    screen: Invoice,
    navigationOptions: {
      header: null
    },
  },
  Settings: {
    screen: Settings,
    navigationOptions: {
      header: null
    },
  }, EditProfile: {
    screen: EditProfile,
    navigationOptions: {
      header: null
    },
  }, Language: {
    screen: Language,
    navigationOptions: {
      header: null
    },
  },
  MenuItems: {
    screen: MenuItems,
    navigationOptions: {
      header: null
    },
  },
  ItemDetails: {
    screen: ItemDetails,
    navigationOptions: {
      header: null
    },
  },
  Cart: {
    screen: Cart,
    navigationOptions: {
      header: null
    },
  },
  Orders: {
    screen: Orders,
    navigationOptions: {
      header: null
    },
  },
  OrderDetails: {
    screen: OrderDetails,
    navigationOptions: {
      header: null
    },
  },
  Payment: {
    screen: Payment,
    navigationOptions: {
      header: null
    },
  },
  Maps: {
    screen: Maps,
    navigationOptions: {
      header: null
    },
  },
  ContactHome: {
    screen: ContactHome,
    navigationOptions: {
      header: null
    },
  },
  ReferAFriendPage: {
    screen: ReferAFriendPage,
    navigationOptions: {
      header: null
    },
  },
  AddWater: {
    screen: AddWater,
    navigationOptions: {
      header: null
    },
  },
  Reminder: {
    screen: Reminder,
    navigationOptions: {
      header: null
    },
  },
  ClassHome: {
    screen: ClassHome,
    navigationOptions: {
      header: null
    },
  },
  ClassDetailsBeforeBuy: {
    screen: ClassDetailsBeforeBuy,
    navigationOptions: {
      header: null
    },
  },
  ClassDetailsAfterBuy: {
    screen: ClassDetailsAfterBuy,
    navigationOptions: {
      header: null
    },
  },
  PaymentClass: {
    screen: PaymentClass,
    navigationOptions: {
      header: null
    },
  },
  Feedback: {
    screen: Feedback,
    navigationOptions: {
      header: null
    },
  },
  RewardMember: {
    screen: RewardMember,
    navigationOptions: {
      header: null
    },
  },
  Announcement: {
    screen: Announcement,
    navigationOptions: {
      header: null
    },
  },
  AnnouncementDetails: {
    screen: AnnouncementDetails,
    navigationOptions: {
      header: null
    },
  },
  ChangePassword: {
    screen: ChangePassword,
    navigationOptions: {
      header: null
    },
  },
  MemberAttendance: {
    screen: MemberAttendance,
    navigationOptions: {
      header: null
    },
  },
  Notifications: {
    screen: Notifications,
    navigationOptions: {
      header: null
    },
  },
  BookAppointmentNavigator: {
    screen: BookAppointmentNavigator,
    navigationOptions: {
      header: null
    },
  },
  QuestionOne: {
    screen: QuestionOne,
    navigationOptions: {
      header: null
    },
  },
  QuestionTwo: {
    screen: QuestionTwo,
    navigationOptions: {
      header: null
    },
  },
  QuestionThree: {
    screen: QuestionThree,
    navigationOptions: {
      header: null
    }
  },
  About: {
    screen: About,
    navigationOptions: {
      header: null
    }
  }
}, {
  defaultNavigationOptions: {
    gesturesEnabled: false,
  }
})

//MEMBER NO PACKAGE NAVIGATOR 
const NoPackageNavigator = createStackNavigator({
  InitialHomePage: {
    screen: InitialHomePage,
    navigationOptions: {
      header: null
    },
  },
  PackageHome: {
    screen: PackageHome,
    navigationOptions: {
      header: null
    },
  },
  PackageDetails: {
    screen: PackageDetails,
    navigationOptions: {
      header: null
    },
  },
  TrainerQuestionOne: {
    screen: TrainerQuestionOne,
    navigationOptions: {
      header: null
    },
  },
  TrainerQuestionTwo: {
    screen: TrainerQuestionTwo,
    navigationOptions: {
      header: null
    },
  },
  TrainerQuestionThree: {
    screen: TrainerQuestionThree,
    navigationOptions: {
      header: null
    },
  },
  PaymentPackage: {
    screen: PaymentPackage,
    navigationOptions: {
      header: null
    },
  },
  PaymentIfQuestion: {
    screen: PaymentIfQuestion,
    navigationOptions: {
      header: null
    },
  }, Invoice: {
    screen: Invoice,
    navigationOptions: {
      header: null
    },
  }, Settings: {
    screen: Settings,
    navigationOptions: {
      header: null
    },
  }, EditProfile: {
    screen: EditProfile,
    navigationOptions: {
      header: null
    },
  }, Language: {
    screen: Language,
    navigationOptions: {
      header: null
    },
  },
  ReferAFriendPage: {
    screen: ReferAFriendPage,
    navigationOptions: {
      header: null
    },
  },
  Maps: {
    screen: Maps,
    navigationOptions: {
      header: null
    },
  },
  ContactHome: {
    screen: ContactHome,
    navigationOptions: {
      header: null
    },
  },
  RewardMember: {
    screen: RewardMember,
    navigationOptions: {
      header: null
    },
  },
  Announcement: {
    screen: Announcement,
    navigationOptions: {
      header: null
    },
  },
  AnnouncementDetails: {
    screen: AnnouncementDetails,
    navigationOptions: {
      header: null
    },
  },
  ChangePassword: {
    screen: ChangePassword,
    navigationOptions: {
      header: null
    },
  },
  Notifications: {
    screen: Notifications,
    navigationOptions: {
      header: null
    },
  },
  Feedback: {
    screen: Feedback,
    navigationOptions: {
      header: null
    },
  },
  ClassHome: {
    screen: ClassHome,
    navigationOptions: {
      header: null
    },
  },
  ClassDetailsBeforeBuy: {
    screen: ClassDetailsBeforeBuy,
    navigationOptions: {
      header: null
    },
  },
  ClassDetailsAfterBuy: {
    screen: ClassDetailsAfterBuy,
    navigationOptions: {
      header: null
    },
  },
  PaymentClass: {
    screen: PaymentClass,
    navigationOptions: {
      header: null
    },
  },
  QuestionOne: {
    screen: QuestionOne,
    navigationOptions: {
      header: null
    },
  },
  QuestionTwo: {
    screen: QuestionTwo,
    navigationOptions: {
      header: null
    },
  },
  QuestionThree: {
    screen: QuestionThree,
    navigationOptions: {
      header: null
    },
  },
  About: {
    screen: About,
    navigationOptions: {
      header: null
    }
  }

})

//LOGIN-SIGNUP AUTH STACK NAVIGATOR
const AuthStackNavigator = createStackNavigator({
  Login: {
    screen: Login,
    navigationOptions: {
      header: null,
    }
  },
  SignUp: {
    screen: SignUp,
    navigationOptions: {
      header: null,
    },
  },
  EmailVerification: {
    screen: EmailVerification,
    navigationOptions: {
      header: null,
    },
  }
}, {
  defaultNavigationOptions: {
    gesturesEnabled: false
  }
})

//ADMIN MAIN TAB NAVIGATOR
const AdminMainTabNaviigator = createBottomTabNavigator({
  AdminHomePage: {
    screen: AdminHomePage,
    navigationOptions: {
      tabBarIcon: ({ tintColor }) => <Icon name='home' size={25} color={tintColor} />
    }
  }

}, {
  tabBarOptions: {
    activeTintColor: '#1976d2',
    labelStyle: {
      fontSize: width / 28,
    },
    style: {
      height: height / 12,
      padding: height / 120
    }
  }
})

//ADMIN APP STACK NAVIGATOR
const AdminAppStackNavigator = createStackNavigator({
  AdminMainTabNaviigator: {
    screen: AdminMainTabNaviigator,
    navigationOptions: {
      header: null,
    }
  },

  Notifications: {
    screen: Notifications,
    navigationOptions: {
      header: null
    },
  },
  ChangePassword: {
    screen: ChangePassword,
    navigationOptions: {
      header: null
    },
  },
  Settings: {
    screen: Settings,
    navigationOptions: {
      header: null
    },
  }, Language: {
    screen: Language,
    navigationOptions: {
      header: null
    },
  },
  AdminPackageDetails: {
    screen: AdminPackageDetails,
    navigationOptions: {
      header: null
    },
  },
  AdminRevenueDetails: {
    screen: AdminRevenueDetails,
    navigationOptions: {
      header: null
    },
  },
  AdminMostSellingProduct: {
    screen: AdminMostSellingProduct,
    navigationOptions: {
      header: null
    },
  },
  AdminMemberAttendance: {
    screen: AdminMemberAttendance,
    navigationOptions: {
      header: null
    },
  },
  AdminBranchSales: {
    screen: AdminBranchSales,
    navigationOptions: {
      header: null
    },
  },
  About: {
    screen: About,
    navigationOptions: {
      header: null
    }
  },
  AdminFeedback: {
    screen: AdminFeedback,
    navigationOptions: {
      header: null
    }
  },
  AdminFeedbackDetails: {
    screen: AdminFeedbackDetails,
    navigationOptions: {
      header: null
    }
  },
  AdminAddFeedback: {
    screen: AdminAddFeedback,
    navigationOptions: {
      header: null
    }
  }
}, {
  defaultNavigationOptions: {
    gesturesEnabled: false,
  }
})

//DRAWER MENU BAR FOR MEMBER WHEN NO FINGER AUTH ENGLISH
const NoPackageDrawerNavigator = createDrawerNavigator({
  NoPackageNavigator: {
    screen: NoPackageNavigator
  }
}, {
  contentComponent: DrawerMenuBar,
  drawerType: 'slide',
  drawerPosition: 'left'
})

//DRAWER MENU BAR FOR MEMBER WHEN NO FINGER AUTH ARABIC
const NoPackageDrawerNavigatorArabic = createDrawerNavigator({
  NoPackageNavigator: {
    screen: NoPackageNavigator
  }
}, {
  contentComponent: DrawerMenuBar,
  drawerType: 'slide',
  drawerPosition: 'right'
})

//DRAWER MENU BAR FOR MEMBER WHEN FINGER AUTH ENGLISH
const MainDrawerNavigator = createDrawerNavigator({
  AppStackNavigator: {
    screen: AppStackNavigator
  }
}, {
  contentComponent: DrawerMenuBar,
  drawerType: 'slide',
})

//DRAWER MENU BAR FOR MEMBER WHEN FINGER AUTH ARABIC
const MainDrawerNavigatorArabic = createDrawerNavigator({
  AppStackNavigator: {
    screen: AppStackNavigator
  }
}, {
  contentComponent: DrawerMenuBar,
  drawerType: 'slide',
  drawerPosition: 'right'

})

//DRAWER MENU BAR FOR TRAINER ENGLISH
const TrainerMainDrawerNavigator = createDrawerNavigator({
  TrainerAppStackNavigator: {
    screen: TrainerAppStackNavigator
  }
}, {
  contentComponent: TrainerDrawerMenuBar,
  drawerType: 'slide',
  drawerPosition: 'left'
})

//DRAWER MENU BAR FOR TRAINER ARABIC
const TrainerMainDrawerNavigatorArabic = createDrawerNavigator({
  TrainerAppStackNavigator: {
    screen: TrainerAppStackNavigator
  }
}, {
  contentComponent: TrainerDrawerMenuBar,
  drawerType: 'slide',
  drawerPosition: 'right'
})

//DRAWER MENU BAR FOR ADMIN ENGLISH
const AdminMainDrawerNavigator = createDrawerNavigator({
  AdminAppStackNavigator: {
    screen: AdminAppStackNavigator
  }
}, {
  contentComponent: AdminDrawerMenuBar,
  drawerType: 'slide',
  drawerPosition: 'left'
})

//DRAWER MENU BAR FOR ADMIN ARABIC
const AdminMainDrawerNavigatorArabic = createDrawerNavigator({
  AdminAppStackNavigator: {
    screen: AdminAppStackNavigator
  }
}, {
  contentComponent: AdminDrawerMenuBar,
  drawerType: 'slide',
  drawerPosition: 'right'
})

const SwitchNavigator = createSwitchNavigator({
  AuthLoadingScreen: AuthLoadingScreen,
  AuthStackNavigator: AuthStackNavigator,
  NoPackageDrawerNavigator: NoPackageDrawerNavigator,
  NoPackageDrawerNavigatorArabic: NoPackageDrawerNavigatorArabic,
  MainDrawerNavigatorArabic: MainDrawerNavigatorArabic,
  MainDrawerNavigator: MainDrawerNavigator,
  TrainerMainDrawerNavigator: TrainerMainDrawerNavigator,
  TrainerMainDrawerNavigatorArabic: TrainerMainDrawerNavigatorArabic,
  AdminMainDrawerNavigator: AdminMainDrawerNavigator,
  AdminMainDrawerNavigatorArabic: AdminMainDrawerNavigatorArabic
})

export const Navigators = createAppContainer(SwitchNavigator)