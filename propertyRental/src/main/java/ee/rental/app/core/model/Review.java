package ee.rental.app.core.model;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.PrimaryKeyJoinColumn;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.IntSequenceGenerator.class,property="@reviewId")
public class Review {
	@Id @GeneratedValue
	private Long id;
	//@JoinColumn(name="accountId")
	@OneToOne(cascade=CascadeType.ALL)
	//@PrimaryKeyJoinColumn
	private UserAccount author;
	@OneToOne(cascade=CascadeType.ALL)
	//@PrimaryKeyJoinColumn
	@JsonIgnore
	private Property property;
	private String review;
	private int stars;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public UserAccount getAuthor() {
		return author;
	}
	public void setAuthor(UserAccount author) {
		this.author = author;
	}
	public String getReview() {
		return review;
	}
	public void setReview(String review) {
		this.review = review;
	}
	public int getStars() {
		return stars;
	}
	public void setStars(int stars) {
		this.stars = stars;
	}
}
