// add admins accounts By Tarek
function checkAdminInLocalStorage() {
    let users = JSON.parse(localStorage.getItem("usersData")) || [];

    const adminEmails = [
        "test@example.com",
        "admin1@example.com",
        "admin2@example.com",
    ];

    const isAdminExist = users.some(
        (user) => adminEmails.includes(user.email) || user.role === "admin"
    );

    if (!isAdminExist) {
        const adminUsers = [
          {
            username: "Tarek97",
            fname: "Tarek",
            lname: "Hegazy",
            email: "tarek95506@gmail.com",
            password: "123456",
            phone: "01021320018",
            address: "Egypt",
            bod: "1997-12-01",
            role: "admin",
            userId: 1,
          },
          {
            username: "Ahmed",
            fname: "Ahmed",
            lname: "Yasser",
            email: "ahmed@gmail.com",
            password: "admin123",
            phone: "01098765432",
            address: "Egypt",
            bod: "1997-12-01",
            role: "admin",
            userId: 2,
          },
          {
            username: "Hamada",
            fname: "Hamada",
            lname: "Waael",
            email: "hamada@gmail.com",
            password: "admin123",
            phone: "01012345678",
            address: "Egypt",
            bod: "2002-01-01",
            role: "admin",
            userId: 3,
          },
          {
            username: "Aya",
            fname: "Aya",
            lname: "Ramdan",
            email: "aya@gmail.com",
            password: "admin123",
            phone: "01012345678",
            address: "Egypt",
            bod: "2002-01-01",
            role: "admin",
            userId: 4,
          },
          {
            username: "Maryam",
            fname: "Maryam",
            lname: "Mohammed",
            email: "mary@gmail.com",
            password: "admin123",
            phone: "01012345678",
            address: "Egypt",
            bod: "2002-01-01",
            role: "admin",
            userId: 5,
          },
          {
            username: "TarekSeller",
            fname: "Tarek",
            lname: "Hegazy",
            email: "tarek@gmail.com",
            password: "123456",
            phone: "01012345678",
            address: "Egypt",
            bod: "2002-01-01",
            role: "seller",
            userId: 6,
          },
          {
            username: "TarekCustomer",
            fname: "Tarek",
            lname: "Hegazy",
            email: "tarek1@gmail.com",
            password: "123456",
            phone: "01012345678",
            address: "Egypt",
            bod: "2002-01-01",
            role: "customer",
            userId: 7,
          },
        ];

        // إضافة حسابات الأدمن إلى الـ localStorage
        users.push(...adminUsers);
        localStorage.setItem("usersData", JSON.stringify(users));
    }
}

// تنفيذ التحقق عند تحميل الصفحة
checkAdminInLocalStorage();
