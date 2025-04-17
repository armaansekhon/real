import Property from "../assets/svg/property.svg"
import Loc from "../assets/svg/loc.svg"
import CRM from "../assets/svg/CRM.svg"
import Brief from "../assets/svg/breif.svg"



export const modules = [
    {
      name: "Home",
      path: "/(drawer)/(tabs)/Home",
      title: "Tabs",
    //   icon: "home-outline",
      icon: Property,
     
    },
    {
      name: "HR",
      path: "/(drawer)/HR",
      title: "HR",
    //   icon: "briefcase-outline",
      icon: Brief,
      children: [
       
        {
          name: "E-Manage",
          path: "/(drawer)/HR/E-Manage",
          title: "Employee Management",
          children: [
            {
              name: "AddEmp",
              path: "/(drawer)/HR/E-Manage/AddEmp",
              title: "Add Employee",
            },
            {
              name: "ViewUpEmp",
              path: "/(drawer)/HR/E-Manage/ViewUpEmp",
              title: "View/Update Employee",
            },
          ],
        },
      ],
    },
    {
        name: "Geolocation",
        path: "/(drawer)/Geolocation",
        title: "Geolocation",
        // icon: "person-outline",
        icon: Loc,
      },
      {
        name: "MarkAttendance",
        path: "/(drawer)/MarkAttendance",
        title: "Mark Attendance",
        // icon: "person-outline",
        icon: CRM,
      },
    
  ];