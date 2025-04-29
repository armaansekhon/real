import Property from "../assets/svg/property.svg"
import Loc from "../assets/svg/loc.svg"
import CRM from "../assets/svg/CRM.svg"
import Brief from "../assets/svg/breif.svg"

export const defaultModules   = [
    {
      name: "Home",
      path: "/(drawer)/(tabs)/Home",
      title: "Tabs",
    //   icon: "home-outline",
      icon: Property,
      alwaysVisible: true
     
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
            {
              name: "MarkAttend",
              path: "/(drawer)/HR/E-Manage/MarkAttend",
              title: "Employee Attendence",
            },
           
          ],
        },
      ],
    },

    {
      name:"Leaves",
      path: "/(drawer)/Leaves",
      title: "Leaves",

      icon: Brief,
     children: [
      {
        name: "ApplyLeave",
        path: "/(drawer)/Leaves/ApplyLeave",
        title: "Apply Leave",
        alwaysVisible: true
      },
      {
        name: "ManageLeaves",
        path: "/(drawer)/Leaves/ManageLeaves",
        title: "Manage Leave",
       
      },

      ]

    },







    {
        name: "InventoryManagement",
        path: "/(drawer)/InventoryManagement",
        title: "Inventory Management",
        icon: Brief,
        children: [
          {
            name: "ViewLeads",
            path: "/(drawer)/InventoryManagement/ViewLeads",
            title: "View Leads",
          },
          {
            name: "AssignLead",
            path: "/(drawer)/InventoryManagement/AssignLead",
            title: "Assign Lead",
          },
          {
            name: "AddLead",
            path: "/(drawer)/InventoryManagement/AddLead",
            title: "Add Lead",
          },
          {
            name: "FollowUp",
            path: "/(drawer)/InventoryManagement/FollowUp",
            title: "Follow Up",
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
        name: "MarkAttendence",
        path: "/(drawer)/MarkAttendence",
        title: "My Attendance",
        // icon: "person-outline",
        icon: CRM,
        alwaysVisible: true
      },
    
  ];
