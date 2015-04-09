package ee.rental.app.core.model;

import java.util.Date;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.PrimaryKeyJoinColumn;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.IntSequenceGenerator.class,property="atreviewId")
public class Review {
	@Id @GeneratedValue
	private Long id;
	//@JoinColumn(name="accountId")
	@OneToOne
	//@PrimaryKeyJoinColumn
	private UserAccount author;
	@OneToOne
	//@PrimaryKeyJoinColumn
	@JsonIgnore
	private Property property;
	@OneToOne
	private Review parentReview;
	private String review;
	private Integer stars;
	private Date addingDate;
	public Date getAddingDate() {
		return addingDate;
	}
	public void setAddingDate(Date addingDate) {
		this.addingDate = addingDate;
	}
	public Review getParentReview() {
		return parentReview;
	}
	public void setParentReview(Review parentReview) {
		this.parentReview = parentReview;
	}
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
	public Integer getStars() {
		return stars;
	}
	public void setStars(Integer stars) {
		this.stars = stars;
	}
	@JsonIgnore
	public Property getProperty() {
		return property;
	}
	@JsonProperty
	public void setProperty(Property property) {
		this.property = property;
	}
}
