package ee.rental.app.core.model.wrapper;

import ee.rental.app.core.model.Review;

public class ReviewWrapper {
	private Long id;
	private Long parentReviewId;
	private Long propertyId;
	private String review;
	private Integer stars;
	private String username;
	public ReviewWrapper(){}
	public ReviewWrapper(Review r){
		if(r.getParentReview() != null)
			this.parentReviewId = r.getParentReview().getId();
		this.propertyId = r.getProperty().getId();
		this.review = r.getReview();
		this.stars = r.getStars();
		this.username = r.getAuthor().getUsername();
		this.id = r.getId();
	}
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getUsername() {
		return username;
	}
	public void setUsername(String username) {
		this.username = username;
	}
	public Long getParentReviewId() {
		return parentReviewId;
	}
	public void setParentReviewId(Long parentReviewId) {
		this.parentReviewId = parentReviewId;
	}
	public Long getPropertyId() {
		return propertyId;
	}
	public void setPropertyId(Long propertyId) {
		this.propertyId = propertyId;
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
}
