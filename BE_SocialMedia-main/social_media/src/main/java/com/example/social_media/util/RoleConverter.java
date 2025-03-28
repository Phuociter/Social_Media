// package com.example.social_media.util;

// import jakarta.persistence.AttributeConverter;
// import jakarta.persistence.Converter;
// import com.example.social_media.entity.User;


// @Converter(autoApply = true)
// public class RoleConverter implements AttributeConverter<User.Role, String> {

//     @Override
//     public String convertToDatabaseColumn(User.Role attribute) {
//         if (attribute == null) {
//             return null;
//         }
//         // Lưu dưới dạng chữ hoa
//         return attribute.name();
//     }

//     @Override
//     public User.Role convertToEntityAttribute(String dbData) {
//         if (dbData == null) {
//             return null;
//         }
//         // Chuyển đổi giá trị nhận được thành chữ hoa trước khi so sánh với enum
//         return User.Role.valueOf(dbData.toUpperCase());
//     }
// }

