export const modules = [
    {
      name: "Tabs",
      path: "/(drawer)/(tabs)",
      title: "Tabs",
      icon: "home-outline",
     
    },
    {
      name: "HR",
      path: "/(drawer)/HR",
      title: "HR",
      icon: "briefcase-outline",
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
              title: "View Employee",
            },
          ],
        },
      ],
    },
    {
        name: "Geolocation",
        path: "/(drawer)/Geolocation",
        title: "Geolocation",
        icon: "person-outline",
      },
      {
        name: "MarkAttendance",
        path: "/(drawer)/MarkAttendance",
        title: "Mark Attendance",
        icon: "person-outline",
      },
      {
        name: "Geolocatio",
        path: "/(drawer)/Geolocation",
        title: "Geolocation",
        icon: "person-outline",
      },
      {
        name: "MarkAttendanc",
        path: "/(drawer)/MarkAttendance",
        title: "Mark Attendance",
        icon: "person-outline",
      },
  ];