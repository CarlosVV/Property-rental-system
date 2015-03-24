package ee.rental.app.core.model;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import javax.persistence.OneToOne;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;

@Entity
@JsonIdentityInfo(generator = ObjectIdGenerators.IntSequenceGenerator.class,property="@imagePathId")
public class ImagePath {
	@Id @GeneratedValue
	private long id;
	private String path;
	@OneToOne(cascade=CascadeType.ALL)
	@JsonIgnore
	private Property property;
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getPath() {
		return path;
	}
	public void setPath(String path) {
		this.path = path;
	}
	public Property getApartment() {
		return property;
	}
	public void setApartment(Property property) {
		this.property = property;
	}
}
