package com.ecommerce.config;

import com.ecommerce.entity.Product;
import com.ecommerce.entity.Role;
import com.ecommerce.entity.User;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            User admin = new User();
            admin.setUsername("admin");
            admin.setPassword(passwordEncoder.encode("admin123"));
            admin.setEmail("admin@producthub.com");
            admin.setFullName("Admin User");
            admin.setRole(Role.ADMIN);
            admin.setProvider("local");
            userRepository.save(admin);
            
            User user = new User();
            user.setUsername("user");
            user.setPassword(passwordEncoder.encode("user123"));
            user.setEmail("user@producthub.com");
            user.setFullName("Regular User");
            user.setRole(Role.USER);
            user.setProvider("local");
            userRepository.save(user);
        }
        
        if (productRepository.count() == 0) {
            List<Product> products = Arrays.asList(
                createProduct("MacBook Pro", "Apple MacBook Pro 14-inch with M3 chip", new BigDecimal("1999.99"), "Electronics", "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400"),
                createProduct("iPhone 15 Pro", "Apple iPhone 15 Pro Max 256GB", new BigDecimal("1199.99"), "Electronics", "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400"),
                createProduct("Sony WH-1000XM5", "Sony WH-1000XM5 Wireless Noise Canceling Headphones", new BigDecimal("399.99"), "Electronics", "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400"),
                createProduct("Nike Air Max", "Nike Air Max 270 Running Shoes", new BigDecimal("149.99"), "Fashion", "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"),
                createProduct("Levi's Jeans", "Levi's 501 Original Fit Jeans", new BigDecimal("79.99"), "Fashion", "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400"),
                createProduct("Samsung TV", "Samsung 65-inch 4K QLED Smart TV", new BigDecimal("1299.99"), "Electronics", "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400")
            );
            
            productRepository.saveAll(products);
        }
    }
    
    private Product createProduct(String name, String description, BigDecimal price, String category, String imageUrl) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        product.setCategory(category);
        product.setImageUrl(imageUrl);
        product.setStock(100);
        product.setActive(true);
        return product;
    }
}
