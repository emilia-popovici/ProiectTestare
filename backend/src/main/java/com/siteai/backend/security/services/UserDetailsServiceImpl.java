package com.siteai.backend.security.services;

import com.siteai.backend.models.User;
import com.siteai.backend.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import java.util.ArrayList; // Folosim o listă goală pentru autorități, deocamdată

@Service // Marchează aceasta ca o clasă de servicii Spring
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String loginInput) throws UsernameNotFoundException {
        // Cautam daca email ul sau user ul corespunde unui utilizator
        User user = userRepository.findByUsernameOrEmail(loginInput, loginInput)
                .orElseThrow(() -> new UsernameNotFoundException("User Not Found with username or email: " + loginInput));

        // Îl convertim la formatul pe care îl înțelege Spring Security
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                new ArrayList<>() // O listă goală de roluri/autorități
        );
    }
}