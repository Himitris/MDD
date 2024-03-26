package com.openclassrooms.mddapi.model;

import lombok.*;
import lombok.experimental.Accessors;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.Collection;

@Entity
@Table(name = "USERS", uniqueConstraints = {
    @UniqueConstraint(columnNames = "email"),
    @UniqueConstraint(columnNames = "username")
})
@Data
@Accessors(chain = true)
@EntityListeners(AuditingEntityListener.class)
@Builder
@NoArgsConstructor
@RequiredArgsConstructor
@AllArgsConstructor
@ToString
public class User implements UserDetails{
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @NonNull
  private String username;

  @NonNull
  private String email;

  @NonNull
  private String password;

  @CreatedDate
  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  @Override
  public Collection<? extends GrantedAuthority> getAuthorities() {
      return null;
  }

  @Override
  public boolean isAccountNonExpired() {
      return true;
  }

  @Override
  public boolean isAccountNonLocked() {
      return true;
  }

  @Override
  public boolean isCredentialsNonExpired() {
      return true;
  }

  @Override
  public boolean isEnabled() {
      return true;
  }

}
