package ee.rental.app.core.model;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.MappedSuperclass;

@MappedSuperclass
public class BaseLookup {
	@Id
	@Column(name="id")
	private Long id;
	@Column(name="name")
	private String name;
	@Column(name="description")
	private String descrription;
	public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getDescrription() {
		return descrription;
	}
	public void setDescrription(String descrription) {
		this.descrription = descrription;
	}
}
