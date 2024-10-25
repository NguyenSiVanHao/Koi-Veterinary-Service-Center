package com.koicenter.koicenterbackend.configuration;

import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.oauth2.jose.jws.MacAlgorithm;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    CustomJwtFilter customJwtFilter;
    @Value("${myapp.api-key}")
    private String privateKey;
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource())) // CORS configuration
                .csrf(AbstractHttpConfigurer::disable)
                .oauth2Login(oauth2 -> oauth2
                        .successHandler(customSuccessHandler()) // Use a custom success handler
                )

                .authorizeHttpRequests(auth -> {
                    auth
                            .requestMatchers(HttpMethod.POST, "/api/v1/login").permitAll()
                            .requestMatchers("/swagger-ui/**",  "/api/v1/auth/**",
                                    "/v2/api-docs",
                                    "/v3/api-docs",
                                    "/v3/api-docs/**",
                                    "/swagger-resources",
                                    "/swagger-resources/**",
                                    "/configuration/ui",
                                    "/configuration/security",
                                    "/swagger-ui/**",
                                    "/webjars/**",
                                    "/api/v1/services",

                                    "/api/v1/veterinarians/**",
                                    "/api/v1/veterinarians/{vetId}",

                                    "api/v1/services/appointmentType/**",
                                    "/swagger-ui.html").permitAll()
                            .requestMatchers(HttpMethod.POST, "/api/v1/users/register").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/v1/services/{serviceId}","/api/v1/vetSchedules").permitAll()
                            .requestMatchers(HttpMethod.POST, "/api/v1/kois/create").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/v1/services/appointmentType/{serviceFor}").permitAll()


                            .requestMatchers(HttpMethod.GET, "/api/v1/vetSchedules/getVeterinariansByDateTime").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/v1/vetSchedules/{vetId}/schedules").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/v1/vetSchedules/{vetId}/schedules/by-date").permitAll()
                            .requestMatchers(HttpMethod.PUT, "/api/v1/vetSchedules/{scheduleId}/schedules/update").permitAll()


                            .requestMatchers(HttpMethod.POST, "/api/v1/vetSchedules/create").permitAll()
                            .requestMatchers(HttpMethod.PUT, "/api/v1/vetSchedules/update").permitAll()


                            .requestMatchers(HttpMethod.GET, "/api/v1/veterinarians").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/v1/veterinarians ").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/v1/veterinarians/{vetId}").permitAll()
                            .requestMatchers(HttpMethod.GET, "api/v1/appointments").permitAll()
                            .requestMatchers(HttpMethod.GET, "api/v1/appointments/getByCustomerId").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/v1/appointments/detail").permitAll()
                            .requestMatchers(HttpMethod.GET, "api/v1/appointments/detailByVetId").permitAll()
                            .requestMatchers(HttpMethod.GET,"api/v1/veterinarians/getByServiceId").permitAll()
                            .requestMatchers(HttpMethod.POST, "api/v1/appointments").permitAll()
                            .requestMatchers(HttpMethod.PUT, "api/v1/appointments/update").permitAll()
                            .requestMatchers(HttpMethod.PUT, "api/v1/appointments/cancel/{appointmentId}").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/v1/appointments/userName/**").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/v1/appointments/by-vetId/{vetId}").permitAll()



                            .requestMatchers(HttpMethod.POST, "api/v1/invoices").permitAll()
                            .requestMatchers(HttpMethod.PUT, "api/v1/invoices/update/**").permitAll()
                            .requestMatchers(HttpMethod.GET, "api/v1/invoices/dashboard/day").permitAll()
                            .requestMatchers(HttpMethod.GET, "api/v1/invoices").permitAll()
                            .requestMatchers(HttpMethod.GET, "api/v1/invoices/**").permitAll()
                            .requestMatchers(HttpMethod.GET, "api/v1/invoices/checkout/**").permitAll()


                            .requestMatchers(HttpMethod.GET, "/api/v1/ponds").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/v1/ponds/{pondId}").permitAll()
                            .requestMatchers(HttpMethod.PUT, "/api/v1/ponds/{pondId}").permitAll()
                            .requestMatchers(HttpMethod.POST, "/api/v1/ponds/create").permitAll()
                            .requestMatchers(HttpMethod.PUT, "/api/v1/ponds/customerId").permitAll()
                            .requestMatchers(HttpMethod.DELETE, "/api/v1/ponds/{pondId}").permitAll()

                            .requestMatchers(HttpMethod.GET, "/api/v1/kois").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/v1/kois/{koiId}").permitAll()
                            .requestMatchers(HttpMethod.PUT, "/api/v1/kois/{koiId}").permitAll()
                            .requestMatchers(HttpMethod.PUT, "/api/v1/kois/customerId").permitAll()
                            .requestMatchers(HttpMethod.DELETE, "/api/v1/kois/{koiId}").permitAll()



                            .requestMatchers(HttpMethod.GET, "/api/v1/treatments").permitAll()
                            .requestMatchers(HttpMethod.POST, "/api/v1/treatments/ponds").permitAll()
                            .requestMatchers(HttpMethod.POST, "/api/v1/treatments/kois").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/v1/treatments/**").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/v1/treatments/search").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/v1/treatments/ponds/**").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/v1/treatments/kois/**").permitAll()
                            .requestMatchers(HttpMethod.PUT, "/api/v1/treatments/**").permitAll()


                            .requestMatchers(HttpMethod.GET, "/api/v1/prescriptions").permitAll()
                            .requestMatchers(HttpMethod.POST, "/api/v1/prescriptions").permitAll()
                            .requestMatchers(HttpMethod.DELETE, "/api/v1/prescriptions/deletePrescriptionMedicineId").permitAll()
                            .requestMatchers(HttpMethod.DELETE, "/api/v1/prescriptions/deletePrescriptionByPrescriptionId").permitAll()


                            .requestMatchers(HttpMethod.GET, "/api/v1/medicines").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/v1/medicines/{medicineId}").permitAll()
                            .requestMatchers(HttpMethod.POST, "/api/v1/medicines").permitAll()
                            .requestMatchers(HttpMethod.PUT, "/api/v1/medicines/{medicineId}").permitAll()
                            .requestMatchers(HttpMethod.DELETE, "/api/v1/medicines/{medicineId}").permitAll()

                            .requestMatchers(HttpMethod.GET, "api/v1/news/id").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/v1/news").permitAll()

                            .requestMatchers(HttpMethod.POST, "/api/v1/feedbacks/**").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/v1/feedbacks/**").permitAll()


                            .requestMatchers(HttpMethod.GET, "api/v1/mail/sendEmail").permitAll()
                           .requestMatchers(HttpMethod.GET, "api/v1/payment/vn-pay").permitAll()
                            .requestMatchers(HttpMethod.GET, "api/v1/payment/vn-pay-callback").permitAll()


                            .requestMatchers(HttpMethod.GET, "/api/v1/customer/{customerId}/kois").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/v1/customer/{customerId}/ponds").permitAll()

                            .requestMatchers(HttpMethod.DELETE, "/api/v1/prescriptions/{prescriptionMedicineId}").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/v1/prescriptions/{prescriptionId}").permitAll()
                            .requestMatchers(HttpMethod.PUT, "/api/v1/prescriptions/{prescriptionId}").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/v1/prescriptions/prescription-medicines/{prescriptionMedicineId}").permitAll()


                            .requestMatchers(HttpMethod.PUT, "/api/v1/deliveries/{deliveryId}").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/v1/deliveries/{deliveryId}").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/v1/deliveries").permitAll()
                            .requestMatchers(HttpMethod.POST, "/api/v1/deliveries").permitAll()
                            .requestMatchers(HttpMethod.DELETE, "/api/v1/deliveries/{deliveryId}").permitAll()

                            .requestMatchers(HttpMethod.GET, "/api/v1/vetSchedules/vetschedules").permitAll()
                            .requestMatchers(HttpMethod.POST, "/api/v1/vetSchedules").permitAll()

                            .requestMatchers(HttpMethod.GET, "api/v1/payment/momo-pay").permitAll()
                            .requestMatchers(HttpMethod.POST, "api/v1/payment/momo-pay-callback").permitAll()


                            .requestMatchers(HttpMethod.POST, "api/v1/forgotPassword/sendMail").permitAll()
                            .requestMatchers(HttpMethod.POST, "api/v1/forgotPassword/verifyOtp").permitAll()

                            .requestMatchers(HttpMethod.POST, "/api/v1/faqs").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/v1/faqs").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/v1/faqs/{faqId}").permitAll()
                            .requestMatchers(HttpMethod.PUT, "/api/v1/faqs/{faqId}").permitAll()
                            .requestMatchers(HttpMethod.DELETE, "/api/v1/faqs/{faqId}").permitAll()

                            .requestMatchers(HttpMethod.POST, "/api/v1/contacts").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/v1/contacts").permitAll()
                            .requestMatchers(HttpMethod.GET, "/api/v1/contacts/{contactId}").permitAll()

                            .requestMatchers(HttpMethod.GET,"api/v1/images")

                            .permitAll()
                            .anyRequest().authenticated();
                });
        http.oauth2ResourceServer(oauth2 -> oauth2.jwt(jwtConfigurer -> jwtConfigurer.decoder(jwtDecoder())));
        http.addFilterBefore(customJwtFilter, UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("*"); // Allow frontend origin
        configuration.addAllowedMethod("*"); // Allow all methods
        configuration.addAllowedHeader("*"); // Allow all headers
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(10);
    }
    @Bean
    JwtDecoder jwtDecoder(){
        SecretKey key = Keys.hmacShaKeyFor(Decoders.BASE64.decode(privateKey));
        return NimbusJwtDecoder
                .withSecretKey(key)
                .macAlgorithm(MacAlgorithm.HS256)
                .build();
    }

    @Bean
    public AuthenticationSuccessHandler customSuccessHandler() {
        SimpleUrlAuthenticationSuccessHandler successHandler = new SimpleUrlAuthenticationSuccessHandler();
        successHandler.setDefaultTargetUrl("/api/v1/auth/loginGoogle"); // Redirect to your desired URL
        return successHandler;
    }
}
